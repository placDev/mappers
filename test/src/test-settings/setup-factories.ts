import * as path from 'path';
import {FixtureManager} from "fixture-lite";

FixtureManager.factories.load({
    srcPath: path.join(__dirname, '..', '..', 'src'),
    filePrefix: '.factory.ts'
})