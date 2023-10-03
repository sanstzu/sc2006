export const helloWorld = (req, res) => {
  res.status(200).json({
    code: 20000,
    success: true,
    message: "Hello World!",
  });
};
