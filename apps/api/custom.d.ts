declare namespace Express {
    export interface Request {
       user?: {
         email: string,
         username: string,
         userId: number,
         sessionId: string,
         iat: number,
         exp: number
       }
    }
 }