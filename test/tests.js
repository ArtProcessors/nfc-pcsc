"use strict";

import test from "ava";
import mock from "mock-require";

// mock @ap-mitch/pcsclite to allow to simulate cards
import pcscliteMock from "./helpers/pcsclite-mock";
mock("@ap-mitch/pcsclite", pcscliteMock);
const NFC = require("../src/NFC").default;

test("first", t => {
	const nfc = new NFC();

	t.truthy(1 === 1);
});
