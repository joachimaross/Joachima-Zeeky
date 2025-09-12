module.exports = {
  'src/**/*.ts': [
    'eslint --ext .ts,.js --fix',
    'prettier --write',
  ],
};
