#!/bin/zsh
cd "$(dirname "$0")" || exit 1
python3 scripts/update-templates.py --package
result=$?
if [[ $result -eq 0 ]]; then
  print '\n목록과 ZIP을 갱신했습니다. index.html을 다시 열어 주세요.'
else
  print '\n목록 갱신에 실패했습니다. 위 오류를 확인해 주세요.'
fi
print '\nEnter를 누르면 닫습니다.'
read -r
exit $result
