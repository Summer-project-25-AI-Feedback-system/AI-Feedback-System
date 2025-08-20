import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";

const client = jwksClient({
  jwksUri: "https://token.actions.githubusercontent.com/.well-known/jwks",
});

function getKey(header: jwt.JwtHeader, callback: jwt.SigningKeyCallback) {
  client.getSigningKey(header.kid as string, (err, key) => {
    if (err || !key)
      return callback(err || new Error("Key not found"), undefined);
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

export function verifyGitHubOIDC(
  audience: string = "api.afs.com"
): (req: Request, res: Response, next: NextFunction) => void {
  return (req: Request, res: Response, next: NextFunction) => {
    console.log("🛡️ Verifying GitHub OIDC token");
    const authHeader = req.headers.authorization;
    console.log("🔐 Auth Header:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "Missing or invalid Authorization header" });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(
      token,
      getKey,
      {
        audience,
        issuer: "https://token.actions.githubusercontent.com",
      },
      (err, decoded) => {
        if (err) {
          console.error("JWT verification failed:", err);
          return res
            .status(403)
            .json({ error: "Unauthorized GitHub Actions token" });
        }

        // Optionally attach decoded claims to request
        (req as any).oidcClaims = decoded;
        next();
      }
    );
  };
}
