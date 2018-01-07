import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';

import { RoomService } from '../services/room.service';

@Component({
    selector: 'create-room',
    templateUrl: './create-room.component.html'
})

export class CreateRoomComponent implements OnInit {
    constructor(private router: Router, private roomService: RoomService, private localSt: LocalStorageService) { }

    ngOnInit() {

    }

    createRoom(form) {
        if (form.value.name) {
            this.localSt.store('name', form.value.name);
            this.roomService.createRoom();
            this.roomService.listen('room-created').subscribe((roomCode) => {
                this.router.navigateByUrl('/play/' + roomCode + '/lobby');
            });
        }
    }
}