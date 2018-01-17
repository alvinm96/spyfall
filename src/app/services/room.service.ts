import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

import * as io from 'socket.io-client';
import * as locations from '../locations.json';

@Injectable()
export class RoomService {
  socket: any;
  numLocations: number;
  numPlayers: number;
  numSpies: number = 1;
  gameInfo = new BehaviorSubject<Object>(null);
  isGameOver = new BehaviorSubject<boolean>(false);

  constructor(private http: Http, private router: Router) {
    this.socket = io(environment.socket.baseUrl);

    this.numLocations = Object.keys(locations).length;

    this.listen('joined-room').subscribe((data) => {
      this.numPlayers = data.players.length;
    });

    this.listen('game-info').subscribe((data) => {
      this.gameInfo.next(data);
    });

    this.listen('game-over').subscribe((data) => {
      this.isGameOver.next(data);
    });
  }

  resetIsGameOver() {
    this.isGameOver.next(false);
  }

  getIsGameOver(): Observable<boolean> {
    return this.isGameOver.asObservable();
  }

  getGameInfo(): Observable<Object> {
    return this.gameInfo.asObservable();
  }

  createRoom() {
    this.socket.emit('create-room');
  }

  joinRoom(info: {roomCode: string, name: string}) {
    this.socket.emit('join-room', info);
  }

  startGame() {
    let locIndex = this.genRanNum(this.numLocations - 1);
    let gameInfo = {
      locIndex: locIndex,
      roles: this.getRoles(locIndex)
    };

    this.socket.emit('game-start', gameInfo);
  }

  endGame() {
    this.socket.emit('end-game');
  }

  leaveRoom(info: {roomCode: string, name: string}) {
    this.socket.emit('leave-room', info);
  }

  changeTime(time: number) {
    this.socket.emit('change-time', time);
  }

  listen(event: string): Observable<any> {
    return new Observable((observer) => {
      this.socket.on(event, (data) => {
        observer.next(data);
      });

      return () => {
        this.socket.off(event);
      }
    });
  }

  getRoles(location: number): string[] {
    let originalRolesAvailable = this.getLocation(location).roles;
    let rolesAvailable = originalRolesAvailable;
    let roles: string[] = []

    for (var i = 0; i < this.numPlayers; i++) {
      if(rolesAvailable.length===0){
        rolesAvailable = originalRolesAvailable;
    }

    var rolePos = this.genRanNum(rolesAvailable.length);
    var role = rolesAvailable[rolePos];
    rolesAvailable.splice(rolePos,1);
    roles.push(role);
    }

    let spyIndex = this.genRanNum(this.numPlayers - 1);
    roles[spyIndex] = 'Spy';

    return roles;
  }

  private getRanLoc() {
    let ranIndex = this.genRanNum(this.numLocations);
    return this.getLocation(ranIndex);
  }

  private genRanNum(max: number) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  getLocation(index: number) {
    let location: string = Object.keys(locations)[index];
    const loc = (<any>locations)[location];
    return loc;
  }
}