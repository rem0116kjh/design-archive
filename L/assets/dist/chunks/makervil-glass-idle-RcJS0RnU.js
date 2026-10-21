//#region resources/ts/makervil-glass-object.ts
var MAKERVIL_SVG_PATH = "M0 0H499.477V1770.523H2180V2270H0Z";
var OBJECT_DEPTH_RATIO = .135;
var OBJECT_BEVEL_RATIO = .032;
var GLASS_THICKNESS = .2;
var GLASS_COLOR = "#ffffff";
var pathToShape = (THREE, path) => {
  const tokens = path.match(/[MLHVCZmlhvcz]|-?\d*\.?\d+(?:e[-+]?\d+)?/g) ?? [];
  const shape = new THREE.Shape();
  let index = 0;
  let x = 0;
  let y = 0;
  let command = "";
  const read = () => Number.parseFloat(tokens[index++] ?? "0");
  while (index < tokens.length) {
    if (/^[a-zA-Z]$/.test(tokens[index] ?? "")) command = tokens[index++] ?? "";
    switch (command) {
      case "M":
        x = read();
        y = read();
        shape.moveTo(x, -y);
        command = "L";
        break;
      case "L":
        x = read();
        y = read();
        shape.lineTo(x, -y);
        break;
      case "H":
        x = read();
        shape.lineTo(x, -y);
        break;
      case "V":
        y = read();
        shape.lineTo(x, -y);
        break;
      case "C": {
        const control1X = read();
        const control1Y = read();
        const control2X = read();
        const control2Y = read();
        x = read();
        y = read();
        shape.bezierCurveTo(control1X, -control1Y, control2X, -control2Y, x, -y);
        break;
      }
      case "Z":
      case "z":
        shape.closePath();
        break;
      default: index += 1;
    }
  }
  return shape;
};
var createMakervilGlassObject = ({ THREE, renderer }) => {
  const shape = pathToShape(THREE, MAKERVIL_SVG_PATH);
  const shapeBounds = new THREE.Box2().setFromPoints(shape.getPoints(8));
  const sourceWidth = shapeBounds.max.x - shapeBounds.min.x;
  const bevel = sourceWidth * OBJECT_BEVEL_RATIO;
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: sourceWidth * OBJECT_DEPTH_RATIO,
    curveSegments: 40,
    bevelEnabled: true,
    bevelThickness: bevel * .9,
    bevelSize: bevel,
    bevelOffset: -bevel,
    bevelSegments: 3
  });
  geometry.center();
  geometry.computeBoundingBox();
  const geometrySize = new THREE.Vector3();
  geometry.boundingBox?.getSize(geometrySize);
  const normalizationScale = 1 / Math.max(geometrySize.x, geometrySize.y, 1);
  geometry.scale(normalizationScale, normalizationScale, normalizationScale);
  geometry.computeBoundingBox();
  geometry.boundingBox?.getSize(geometrySize);
  const material = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(GLASS_COLOR),
    metalness: 0,
    reflectivity: 1,
    iridescence: .22,
    iridescenceIOR: 1.22,
    iridescenceThicknessRange: [200, 380],
    transmission: 1,
    roughness: .02,
    thickness: GLASS_THICKNESS,
    ior: 1.5,
    clearcoat: .25,
    clearcoatRoughness: .02,
    attenuationColor: new THREE.Color(GLASS_COLOR),
    attenuationDistance: 1e4,
    envMapIntensity: 1.45,
    specularIntensity: 1
  });
  const mesh = new THREE.Mesh(geometry, material);
  const group = new THREE.Group();
  group.add(mesh);
  const environmentWidth = 64;
  const environmentHeight = 256;
  const environmentData = new Uint16Array(environmentWidth * environmentHeight * 4);
  const environmentStrips = [
    {
      center: .09,
      width: .075,
      intensity: 44
    },
    {
      center: .26,
      width: .028,
      intensity: 26
    },
    {
      center: .42,
      width: .016,
      intensity: 17
    },
    {
      center: .64,
      width: .038,
      intensity: 10
    },
    {
      center: .9,
      width: .075,
      intensity: 4
    }
  ];
  const getEnvironmentLuminance = (value) => {
    let luminance = .16;
    for (const strip of environmentStrips) {
      const distance = Math.abs(value - strip.center) / strip.width;
      if (distance < 1) luminance += strip.intensity * (1 - distance * distance);
    }
    return luminance;
  };
  for (let environmentY = 0; environmentY < environmentHeight; environmentY += 1) {
    const luminance = getEnvironmentLuminance(1 - environmentY / (environmentHeight - 1));
    for (let environmentX = 0; environmentX < environmentWidth; environmentX += 1) {
      const dataIndex = (environmentY * environmentWidth + environmentX) * 4;
      const halfFloatLuminance = THREE.DataUtils.toHalfFloat(luminance);
      environmentData[dataIndex] = halfFloatLuminance;
      environmentData[dataIndex + 1] = halfFloatLuminance;
      environmentData[dataIndex + 2] = halfFloatLuminance;
      environmentData[dataIndex + 3] = THREE.DataUtils.toHalfFloat(1);
    }
  }
  const environmentTexture = new THREE.DataTexture(environmentData, environmentWidth, environmentHeight, THREE.RGBAFormat, THREE.HalfFloatType);
  environmentTexture.mapping = THREE.EquirectangularReflectionMapping;
  environmentTexture.colorSpace = THREE.LinearSRGBColorSpace;
  environmentTexture.minFilter = THREE.LinearFilter;
  environmentTexture.magFilter = THREE.LinearFilter;
  environmentTexture.needsUpdate = true;
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  const environmentRenderTarget = pmremGenerator.fromEquirectangular(environmentTexture);
  pmremGenerator.dispose();
  environmentTexture.dispose();
  return {
    group,
    mesh,
    material,
    geometrySize,
    environmentRenderTarget,
    dispose: () => {
      group.remove(mesh);
      geometry.dispose();
      material.dispose();
      environmentRenderTarget.dispose();
    }
  };
};
//#endregion
//#region resources/ts/makervil-glass-idle.ts
var IDLE_CYCLE_SECONDS = 18;
var IDLE_AMPLITUDE = {
  x: .04,
  y: .14,
  z: .016
};
var getMakervilMobileIdleRotation = (elapsedSeconds, baseRotation) => {
  const phase = elapsedSeconds / IDLE_CYCLE_SECONDS * Math.PI * 2;
  return {
    x: baseRotation.x + Math.sin(phase) * IDLE_AMPLITUDE.x,
    y: baseRotation.y + Math.cos(phase) * IDLE_AMPLITUDE.y,
    z: baseRotation.z + Math.sin(phase * 2) * IDLE_AMPLITUDE.z
  };
};
//#endregion
export { createMakervilGlassObject as n, getMakervilMobileIdleRotation as t };
