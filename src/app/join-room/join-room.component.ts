import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';


import { RoomService } from '../services/room.service';

@Component({
    selector: 'join-room',
    templateUrl: './join-room.component.html'
})

export class JoinRoomComponent implements OnInit {
    constructor(private router: Router, 
                private roomService: RoomService, 
                private localSt: LocalStorageService, 
                private modalService: BsModalService) { }

    ngOnInit() { }

    joinRoom(form) {
        if (form.value.name !== undefined && form.value.roomCode !== undefined) {
            this.localSt.store('name', form.value.name);
            this.router.navigateByUrl('/play/' + form.value.roomCode + '/lobby');
        }
    }
}