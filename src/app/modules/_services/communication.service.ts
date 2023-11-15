import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IncommingCommunicationDto } from '../models/CommunicationDto';
import { LettersHdDto } from '../models/LettersHdDto';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {

  // Getting base URL of Api from enviroment.
  baseUrl = environment.KUPFApiUrl;
  //
  incommingCommunicationDto: IncommingCommunicationDto[] = []
  lettersHdDto: LettersHdDto[]=[];
  constructor(private httpClient: HttpClient) { }

  // Add Incomming Letter
  AddIncomingLetter(response: FormData) {
    return this.httpClient.post(this.baseUrl + `Communication/AddIncomingLetter`, response);
  }
  UpdateIncomingLetter(response: FormData) {    
    return this.httpClient.put(this.baseUrl +`Communication/UpdateIncomingLetter`,response);
  }
  // delete service setup
  DeleteIncomingLetter(transId: number) { 
    return this.httpClient.delete(`${this.baseUrl}Communication/DeleteIncomingLetter/${transId}`);    
  }


  // Get all service setup
  GetIncomingLetters(pageNumber: number, pageSize: number, query: string) {
    // return this.httpClient.get<IncommingCommunicationDto[]>(this.baseUrl + `Communication/GetIncomingLetters`).pipe(
    //   map(incommingCommunicationDto => {
    //     this.incommingCommunicationDto = incommingCommunicationDto;
    //     return incommingCommunicationDto;
    //   })
    // )
    return this.httpClient.get<IncommingCommunicationDto[]>(this.baseUrl + `Communication/GetIncomingLetters?PageNumber=${pageNumber}&PageSize=${pageSize}&Query=${query}`, {observe: 'response'});
  }

  GetIncomingLetter(transId: number) {
    return this.httpClient.get<LettersHdDto[]>(`${this.baseUrl}Communication/GetIncomingLetter/${transId}`).pipe(
      map(lettersHdDto => {
        this.lettersHdDto = lettersHdDto;
        return lettersHdDto;
      })
    )
  }


}
