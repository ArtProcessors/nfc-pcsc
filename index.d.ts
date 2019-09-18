declare module "@ap-mitch/nfc-pcsc" {
	import { EventEmitter } from "events";
	import { PCSCLite, CardReader } from "@ap-mitch/pcsclite";

	export class BaseError extends Error {
		constructor(code: string, message: string, previousError: BaseError);
		code: string;
		previousError: BaseError;
	}

	export type ReaderConnection = {
		type: number;
		protocol: number;
	};

	export type Card = {
		atr?: Buffer;
		standard?: "TAG_ISO_14443_3" | "TAG_ISO_14443_4";
		type?: string;
		uid?: string;
		data?: Buffer;
	};

	export class NFC extends EventEmitter {
		pcsc: PCSCLite;
		logger: any;
		on(
			type: "reader",
			listener: (reader: Reader | ACR12XReader) => void
		): this;
		once(
			type: "reader",
			listener: (reader: Reader | ACR12XReader) => void
		): this;
		on(type: "error", listener: (error: any) => void): this;
		once(type: "error", listener: (error: any) => void): this;
		readonly readers: {
			[name: string]: any;
		};

		close(): void;
	}

	export type ReaderConnectMode = "CONNECT_MODE_DIRECT" | "CONNECT_MODE_CARD";

	export class Reader extends EventEmitter {
		reader: CardReader;
		logger: any;
		connection: ReaderConnection | null;
		card: Card;
		autoProcessing: boolean;
		aid: string | Function | Buffer;
		readonly name: string;

		constructor(reader: CardReader, logger: any);
		connect(mode: ReaderConnectMode): void;
		disconnect(): void;
		transmit(data: Buffer, responseMaxLength: number): Promise<Buffer>;
		control(data: Buffer, responseMaxLength: number): Promise<Buffer>;
		authenticate(
			blockNumber: number,
			keyType: number,
			key: string,
			obsolete?: number
		): Promise<Buffer>;
		read(
			blockNumber: number,
			length: number,
			blockSize?: number,
			packetSize?: number,
			readClass?: number
		): Promise<Buffer>;
		write(
			blockNumber: number,
			data: Buffer,
			blockSize: number
		): Promise<Buffer>;

		on(type: "card", listener: (card: Card) => void): this;
		once(type: "card", listener: (card: Card) => void): this;
		on(type: "card.off", listener: (card: Card) => void): this;
		once(type: "card.off", listener: (card: Card) => void): this;
		on(type: "error", listener: (error: any) => void): this;
		once(type: "error", listener: (error: any) => void): this;
		on(type: "end", listener: () => void): this;
		once(type: "end", listener: () => void): this;

		close(): void;
		toString(): string;
	}

	export class ACR12XReader extends Reader {
		inAutoPoll(): Promise<Buffer>;
		led(led: number, blinking: Array<number>): Promise<Buffer>;
		setBuzzerOutput(enabled?: boolean): Promise<Buffer>;
		setPICC(picc: number): Promise<Buffer>;
	}
}
