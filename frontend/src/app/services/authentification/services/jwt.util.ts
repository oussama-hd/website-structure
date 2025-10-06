// src/app/utils/jwt.utils.ts

export interface DecodedToken {
  exp: number;
  [key: string]: any;
}

// export function   getTokenExpirationDate(token: string): Date | null {
//     try {
//       const decoded = jwtDecode.default<JwtPayload>(token);
//       if (!decoded.exp) return null;
//       const expirationDate = new Date(0);
//       expirationDate.setUTCSeconds(decoded.exp);
//       return expirationDate;
//     } catch (e) {
//       return null;
//     }
//   }
