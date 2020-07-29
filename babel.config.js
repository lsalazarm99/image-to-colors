module.exports = (api) => {
  const isTest = api.env("test");
  api.cache(true);

  return {
    presets: [
      [
        "@babel/preset-env",
        {
          modules: isTest ? "commonjs" : false,
        },
      ],
      "@babel/preset-typescript",
    ],
  };
};
