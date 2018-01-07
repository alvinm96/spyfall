/**
 * Lazy loading game module
 */

import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { ModalModule } from 'ngx-bootstrap';

import { CreateRoomComponent } from './create-room/create-room.component';
import { JoinRoomComponent } from './join-room/join-room.component';
import { LobbyComponent } from './lobby/lobby.component';
import { GameComponent } from './game/game.component';
import { TimePipe } from './pipes/time.pipe';
import { RoomService } from './services/room.service';

const routes: Routes = [
    { path: 'create', component: CreateRoomComponent },
    { path: 'join', component: JoinRoomComponent },
    { path: ':roomCode/lobby', component: LobbyComponent },
    { path: ':roomCode/module', component: GameComponent }
]

@NgModule({
    imports: [
        ModalModule.forRoot(),
        RouterModule.forChild(routes),
        FormsModule,
        CommonModule,
        HttpModule
    ],
    declarations: [
        CreateRoomComponent,
        JoinRoomComponent,
        LobbyComponent,
        GameComponent,
        TimePipe
    ],
    providers: [
        RoomService
    ]
})

export class GameModule { }