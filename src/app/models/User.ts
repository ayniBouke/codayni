export class User {
    serverId : number;
    firstName : string;
    lastName : string;
    identifiant : string;
    phone : string;
    email : string;
    password : string;
    //gpsLocation : Geolocation;
    creationDate : Date;
    modificationDate : Date;
    isActivated : boolean;
    settingServerId : number =1;
    mediaServerId : number;
    type: number;
    userLoginType: number
}