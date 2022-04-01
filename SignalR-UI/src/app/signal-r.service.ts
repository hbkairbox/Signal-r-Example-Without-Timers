import {EventEmitter, Injectable} from '@angular/core';
import {HubConnection, HubConnectionBuilder, LogLevel, HttpTransportType} from '@aspnet/signalr';
@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  message = new EventEmitter<string>();
  public loggedInUser: string;
  private hubConnection: HubConnection;

  constructor() {
    this.createConnection();
    this.register();
    this.startConnection();
  }

  private createConnection() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl('https://localhost:5001/inform?userId=testuser1&operationId=ops12&organisationId=airbox', { 
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets,
        accessTokenFactory: () => "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJncFFuczBYVlVPX1pJWW56MFU4V3J5d1R1LTl1cUx3alZvUWZ1cDRjWWZBIn0.eyJleHAiOjE2NDg4MjQ5ODksImlhdCI6MTY0ODgyMTM4OSwianRpIjoiYmQ0NTY1ZDEtNWJiZC00NjNjLWEwNjItMGU4Njc1YTM3N2Q0IiwiaXNzIjoiaHR0cHM6Ly9rZXljbG9hay1ncmltYWxkaS5hYnhpbnRlcm5hbC5jb20vYXV0aC9yZWFsbXMvZ3JpbWFsZGkiLCJhdWQiOiJhY2NvdW50Iiwic3ViIjoiYzA4YzZjMzItODVkZi00OGM4LWEwZTUtZjJkN2ExNmE5NDc4IiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiYmFja2VuZC1zZXJ2aWNlLWNsaWVudCIsImFjciI6IjEiLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsib2ZmbGluZV9hY2Nlc3MiLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwiLCJjbGllbnRIb3N0IjoiMTguMTMwLjE0Mi40NiIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiY2xpZW50SWQiOiJiYWNrZW5kLXNlcnZpY2UtY2xpZW50IiwicHJlZmVycmVkX3VzZXJuYW1lIjoic2VydmljZS1hY2NvdW50LWJhY2tlbmQtc2VydmljZS1jbGllbnQiLCJjbGllbnRBZGRyZXNzIjoiMTguMTMwLjE0Mi40NiJ9.SR6-bYDxTCHn9kl6k91jWnV-AkDy-w0NVrc_mkqFShJ_GkN2Mm2WcnmEA2BOukg7KVW6QmxdKQGT90VLwyt1m8CHtLtFUYPLpMkyP7Kji7x83dSu_CeJwUBcdkCDCyh4mXPgzGh3pCwW7Uu2MQF-AL72krqQ1Rdrx_RtgZrIQCmCkgoWNMsw8biby_0WfcgsDDS5LgzHn3dbPsDycEc-4NIMD6orgvT_1hP73tdgGPoEBmcoKfaupd4e3NZLuHVXoLN1EvyErNAdtrnDbWznUb-9v4qlAjCUYn-ghmGKMoO-PQw17KYDRFl05ENelC-bBBeBD00gfphEZiBF1r6Nng"
      })
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
