// import rateLimit from "express-rate-limit";

// export default rateLimit({
//   windowMs: 15 * 60 * 1000, 
//   max: 100, 
//   standardHeaders: true, 
//   legacyHeaders: false, 
//   message: "Too many requests, please try again later.",
//   handler: (req, res, next, options) => {
//     const resetTime = Math.ceil(options.windowMs / 1000); 
//     res.setHeader('Retry-After', resetTime); 
//     res.status(429).json({
//       message: options.message,
//     });
//   },
// });
