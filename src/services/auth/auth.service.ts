import { Storage } from '@ionic/storage';
import { AuthHttp, JwtHelper, tokenNotExpired } from 'angular2-jwt';
import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Rx';

// Avoid name not found warnings
declare var Auth0: any;
declare var Auth0Lock: any;

@Injectable()
export class AuthService {

	jwtHelper: JwtHelper = new JwtHelper();
	auth0 = new Auth0({clientID: '14Vv3lVL6Ms17uigZ8DaAySQ4f6XX6Gy', domain: 'buirai.auth0.com' });
	lock = new Auth0Lock('14Vv3lVL6Ms17uigZ8DaAySQ4f6XX6Gy', 'buirai.auth0.com', {
		auth: {
			redirect: false,
			params: {
				scope: 'openid offline_access',
			}
		}
	});

	storage: Storage = new Storage();
	refreshSubscription: any;
	user: Object;
	zoneImpl: NgZone;
	idToken: string;

	constructor(private authHttp: AuthHttp, zone: NgZone){
		this.zoneImpl = zone;
		// Check if there is a profile saved in local storage
		this.storage.get('profile').then(profile => {
			this.user = JSON.parse(profile);
		}).catch(error => {
			console.log(error);
		});

		this.storage.get('id_token').then(token => {
			this.idToken = token;
		});

		this.lock.on('authenticated', authResult => {
			this.storage.set('id_token', authResult.idToken);
			this.idToken = authResult.idToken;

			// Fetch profile information
			this.lock.getProfile(authResult.idToken, (error, profile) => {
				if (error) {
					// Handle error
					alert(error);
					return;
				}

				profile.user_metadata = profile.user_metadata || {};
				this.storage.set('profile', JSON.stringify(profile));
				this.user = profile;
			});

			this.lock.hide();

			this.storage.set('refresh_token', authResult.refreshToken);
			this.zoneImpl.run(() => this.user = authResult.profile);
			// Schedule a token refresh
			this.scheduleRefresh();
		});
	}
}