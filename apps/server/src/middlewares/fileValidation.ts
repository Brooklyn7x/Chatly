import { Request, Response, NextFunction } from "express";
const FILE_RULES = {
  avatar: {
    maxSize: 2 * 1024 * 1024, // 2MB
    mimeTypes: ["image/jpeg", "image/png"],
    dimensions: { min: 128, max: 2048 },
  },
  attachment: {
    maxSize: 25 * 1024 * 1024, // 25MB
    mimeTypes: ["*/*"], // All types with size limit
  },
};

export const validateFile = (type: keyof typeof FILE_RULES) => {
  return (
    req: Request & { file?: Express.Multer.File },
    res: Response,
    next: NextFunction
  ) => {
    const file = req.file;
    const rules = FILE_RULES[type];

    if (!file) return res.status(400).json({ error: "No file uploaded" });

    if (file.size > rules.maxSize) {
      return res.status(413).json({
        error: `File exceeds ${rules.maxSize / 1024 / 1024}MB limit`,
      });
    }

    if (
      rules.mimeTypes[0] !== "*/*" &&
      !rules.mimeTypes.includes(file.mimetype)
    ) {
      return res.status(415).json({
        error: `Invalid file type. Allowed: ${rules.mimeTypes.join(", ")}`,
      });
    }

    next();
  };
};
