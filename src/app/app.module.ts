import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { ItemDetailsPage } from '../pages/item-details/item-details';
import { ListPage } from '../pages/list/list';
import { AuthConfig, AuthHttp } from 'angular2-jwt';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { AuthService } from '../services/auth/auth.service';

let storage: Storage = new Storage();

export function getAuthHttp(http) {
	return new AuthHttp(new AuthConfig({
		globalHeaders: [{'Accept': 'application/json'}],
		tokenGetter: (() => storage.get('id_token'))
	}), http);
}

@NgModule({
	declarations: [
		MyApp,
		HelloIonicPage,
		ItemDetailsPage,
		ListPage
	],
	imports: [
		IonicModule.forRoot(MyApp)
	],
	bootstrap: [IonicApp],
	entryComponents: [
		MyApp,
		HelloIonicPage,
		ItemDetailsPage,
		ListPage
	],
	providers: [
		AuthService,
		{
			// provide: ErrorHandler, (** Ver la forma de agregar 2 providers)
			provide: AuthService,
			useClass: IonicErrorHandler
		}
	]
})
export class AppModule {}
