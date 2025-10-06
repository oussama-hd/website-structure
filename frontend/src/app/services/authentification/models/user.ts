export interface User {
    sub: string;
    usrId: any;
    username: any;
    usrEmail: any;
    usrFirstName: any;
    usrLastName: any;
    usrMobile: any;
    usrDdn: Date;
    usrAdr: any;
    usrActiveFlag?: any;
    usrAdminFlag?: any;
    usrAsrCode?: any;
    usrIdPassport?: any;
    usrLieuPassport?: any;
    usrDatePassport?: Date;
    interestFlag?: any;
    surveyFlag?: any;
    uuid: any;
    iat: number;
    exp: number;
  
  }