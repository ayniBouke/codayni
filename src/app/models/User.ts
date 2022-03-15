import { Media } from "./Media";

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
    mediaServerId : number = 0;
    media? : Media;
    type: number;
    userLoginType: number
}