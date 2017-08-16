import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

@Injectable()
export class DataService {
    private authHeaders;
    private options: RequestOptions;
    private host;

    constructor(private http: Http) {
        if (ENV === 'development') {
            this.host = 'https://api.sello.io/';
            this.authHeaders = {
                'Token': '20b8944077245d88b9968fa8410fa861',
                'Key': '011fd708111244cb1016f3e0deea68ed60b0d9f06b9335a19fa8fb7ed2faa45e'
            };
        } else {
            // Check for correct API URL
            if (window.location.href.indexOf('sandbox2.sello.io') !== -1) {
                this.host = 'https://api-sandbox.sello.io/';
            } else if (window.location.href.indexOf('.sello.io') !== -1) {
                this.host = 'https://api.sello.io/';
            } else if (window.location.href.indexOf('.sello.dev') !== -1) {
                this.host = 'http://pro.sello.dev/api/';
            }

            this.authHeaders = {
                'Token': '9829db2ee4a07892bab61d0090fc2722',
                'Key': '00cf72a614ac8dbecbca9bba15a2fb7e5488b814d31f804c2d55bfbfcbc61428',
            };
        }
    }

    get key() {
        return this.authHeaders.Key;
    }
    
    get token() {
        return this.authHeaders.Token;
    }

    getHost() {
        return this.host;
    }

    getAuthHeaders() {
        if (!this.authHeaders) {
            return [];
        }

        return [
            { name: 'Key', value: this.authHeaders.Key },
            { name: 'Token', value: this.authHeaders.Token },
        ];
    }

    get(url) {
        return this.http.get(this.host + url, this._getOptions());
    }

    post(url, data) {
        return this.http.post(this.host + url, JSON.stringify(data), this._getJsonOptions());
    }

    put(url, data) {
        return this.http.put(this.host + url, JSON.stringify(data), this._getJsonOptions());
    }

    delete(url) {
        return this.http.delete(this.host + url, this._getOptions());
    }

    private _getOptions() {
        return new RequestOptions({ headers: new Headers(this.authHeaders), withCredentials: true });
    }

    private _getJsonOptions() {
        let jsonHeaders = new Headers(this.authHeaders);
        jsonHeaders.append('Content-Type', 'application/json');
        
        return new RequestOptions({ headers: jsonHeaders, withCredentials: true });
    }
}