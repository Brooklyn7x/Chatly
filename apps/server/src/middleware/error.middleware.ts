// // src/middleware/errorHandler.ts
// import { ZodError } from "zod";

// export const errorHandler = (err, req, res, next) => {
//   // Handle Zod validation errors
//   if (err instanceof ZodError) {
//     return res.status(400).json({
//       status: "error",
//       message: "Validation failed",
//       details: err.errors,
//     });
//   }

//   // Handle Firebase errors
//   if (err.code?.startsWith("auth/")) {
//     return res.status(400).json({
//       status: "error",
//       message: err.message,
//     });
//   }

//   // Handle other errors
//   console.error(err);
//   return res.status(500).json({
//     status: "error",
//     message: "Internal server error",
//   });
// };
