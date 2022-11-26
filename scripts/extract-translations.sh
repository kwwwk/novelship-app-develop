# extract translations for develop branch
branch=`git branch --show-current`;
if [[ "$branch" == "develop" ]]
then
   npm run lingui:extract;
   git add locales/**/*.po;
fi
