#!/usr/bin/env node
import 'source-map-support/register'; // source-map을 사용하기 위해 추가함.
import App from './App';

const app = new App();

app.start()