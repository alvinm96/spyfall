import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Ng2Webstorage } from 'ngx-webstorage';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { PlayGameComponent } from './play-game/play-game.component';
import { AboutComponent } from './about/about.component';

import { CommonService } from './services/common.service';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'play', component: PlayGameComponent },
  { path: 'about', component: AboutComponent },
  { path: 'play', loadChildren: './game.module#GameModule' }
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PlayGameComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,
    Ng2Webstorage
  ],
  providers: [
    CommonService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
