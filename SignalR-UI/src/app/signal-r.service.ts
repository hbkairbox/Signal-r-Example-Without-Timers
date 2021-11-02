import {EventEmitter, Injectable} from '@angular/core';
import {HubConnection, HubConnectionBuilder, LogLevel, HttpTransportType} from '@aspnet/signalr';
import * as jwt from 'jsonwebtoken';
@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  message = new EventEmitter<string>();
  public userName: string;
  private hubConnection: HubConnection;
  private loginToken:string;

  constructor() {
    this.createConnection();
    this.register();
    this.startConnection();
  }

  private createConnection() {
    var userData = {
      "userName": "User"+Math.floor(Math.random() * 10)
    }
    console.log(userData.userName);
    this.userName = userData.userName;
    let token = jwt.sign(userData, 'thisIsASecret');
    console.log(token);
    //this.loginToken = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjQyODg2QTlBNzAwREExNjk5ODRDQ0ExMTdDQzkwMjc4ODkzN0ZENDciLCJ0eXAiOiJhdCtqd3QiLCJ4NXQiOiJRb2hxbW5BTm9XbVlUTW9SZk1rQ2VJazNfVWMifQ.eyJuYmYiOjE2MzQ2MDQxOTcsImV4cCI6MTYzNDYwNzc5NywiaXNzIjoiaHR0cDovL2lkZW50aXR5LXNlcnZlci1ncmltYWxkaS5hYnhpbnRlcm5hbC5jb20vIiwiYXVkIjoiYWlyYm94YXBpIiwiY2xpZW50X2lkIjoiYWlyYm94YXBpY2xpZW50IiwiT3JnTmFtZSI6IkFpcmJveCIsIk9yZ0lkIjoiYjAyNTkzN2MtNTY2ZC00YmE3LTkxNTctNDUyOTgyMzk2YzZhIiwic2NvcGUiOlsiYWlyYm94YXBpIl19.N6nLrm3-Xh4EXCkJJPY7x7c8hy0i_tqhhy3y-CUPYHMKKXJbQ2uD1nowvp2E1HwNvIlKvvI9JrEVpY41nTHkxX2UBnqOCHtAjUFZxC2rYyngWiebUidWGMKOOO4cS9PrPgF79g0biNOc6gnCkBwFPy5wK5tF_EUHO1WdcYs-ohIPub2RJTt8fkUGMWX8hk9hBr9d4Wu_d4EUzEIzS3vM9sN4kzFvn6Uj9P80Bx2Su-02jzDV4d6ZXn0Hs4cBgVgpr5cHLQcCwfeWjpeq8MlMxEhwzdD6Riop3grs-Uf0VphwROZ5RN7Lu9JG_Zst5I5zAnYjNDevAnOcpRKnY8PfLg";
    this.hubConnection = new HubConnectionBuilder()
      .withUrl('https://localhost:5001/inform', { 
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets,
        accessTokenFactory: () => token })
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
