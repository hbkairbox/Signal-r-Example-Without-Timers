import {EventEmitter, Injectable} from '@angular/core';
import {HubConnection, HubConnectionBuilder, LogLevel, HttpTransportType} from '@aspnet/signalr';
import * as jwt from 'jsonwebtoken';
@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  message = new EventEmitter<string>();
  public loggedInUser: string;
  private hubConnection: HubConnection;
  private loginToken:string;

  constructor() {
    this.createConnection();
    this.register();
    this.startConnection();
  }

  private createConnection() {
    var userData = {
      "userName": "User"+Math.floor(Math.random() * 10),
      "organisation": "Airbox",
      "operation": "Ops"+Math.floor(Math.random() * 5)
    }
    
    this.loggedInUser = userData.userName + ' is connected. Organisation: '+userData.organisation+', Operation: '+userData.operation;
    this.loginToken = jwt.sign(userData, 'thisIsASecret');
    
    this.hubConnection = new HubConnectionBuilder()
      .withUrl('https://localhost:5001/inform', { 
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets,
        accessTokenFactory: () => this.loginToken })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Debug)
      .build();
  }

  private register(): void {
    this.hubConnection.on('PushNotification', (param: string) => {
      console.log(param);
      this.message.emit(param);
    });
  }

  private startConnection(): void {
    this.hubConnection
      .start()
      .then(() => {
        console.log('Connection started.');
      })
      .catch(err => {
        console.log('Oops!');
      });
  }
}
