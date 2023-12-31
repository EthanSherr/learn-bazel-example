/* eslint-disable */
import type { CallContext, CallOptions } from "nice-grpc-common";
import * as _m0 from "protobufjs/minimal";
import Long = require("long");

export const protobufPackage = "filestream";

export interface AddRequest {
  a: number;
  b: number;
}

export interface AddResult {
  c: number;
}

export interface FileRequest {
  name: string;
  last: string;
}

export interface FileResponse {
  response?: { $case: "chunk"; chunk: FileChunk } | { $case: "metadata"; metadata: FileMetadata } | undefined;
}

export interface FileChunk {
  chunkData: Uint8Array;
}

export interface FileMetadata {
  filename: string;
  mimeType: string;
  fileSize: number;
}

function createBaseAddRequest(): AddRequest {
  return { a: 0, b: 0 };
}

export const AddRequest = {
  encode(message: AddRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.a !== 0) {
      writer.uint32(8).uint64(message.a);
    }
    if (message.b !== 0) {
      writer.uint32(16).uint64(message.b);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AddRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAddRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.a = longToNumber(reader.uint64() as Long);
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.b = longToNumber(reader.uint64() as Long);
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): AddRequest {
    return {
      a: isSet(object.a) ? globalThis.Number(object.a) : 0,
      b: isSet(object.b) ? globalThis.Number(object.b) : 0,
    };
  },

  toJSON(message: AddRequest): unknown {
    const obj: any = {};
    if (message.a !== 0) {
      obj.a = Math.round(message.a);
    }
    if (message.b !== 0) {
      obj.b = Math.round(message.b);
    }
    return obj;
  },
};

function createBaseAddResult(): AddResult {
  return { c: 0 };
}

export const AddResult = {
  encode(message: AddResult, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.c !== 0) {
      writer.uint32(8).uint64(message.c);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AddResult {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAddResult();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.c = longToNumber(reader.uint64() as Long);
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): AddResult {
    return { c: isSet(object.c) ? globalThis.Number(object.c) : 0 };
  },

  toJSON(message: AddResult): unknown {
    const obj: any = {};
    if (message.c !== 0) {
      obj.c = Math.round(message.c);
    }
    return obj;
  },
};

function createBaseFileRequest(): FileRequest {
  return { name: "", last: "" };
}

export const FileRequest = {
  encode(message: FileRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    if (message.last !== "") {
      writer.uint32(18).string(message.last);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): FileRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFileRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.name = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.last = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): FileRequest {
    return {
      name: isSet(object.name) ? globalThis.String(object.name) : "",
      last: isSet(object.last) ? globalThis.String(object.last) : "",
    };
  },

  toJSON(message: FileRequest): unknown {
    const obj: any = {};
    if (message.name !== "") {
      obj.name = message.name;
    }
    if (message.last !== "") {
      obj.last = message.last;
    }
    return obj;
  },
};

function createBaseFileResponse(): FileResponse {
  return { response: undefined };
}

export const FileResponse = {
  encode(message: FileResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    switch (message.response?.$case) {
      case "chunk":
        FileChunk.encode(message.response.chunk, writer.uint32(10).fork()).ldelim();
        break;
      case "metadata":
        FileMetadata.encode(message.response.metadata, writer.uint32(18).fork()).ldelim();
        break;
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): FileResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFileResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.response = { $case: "chunk", chunk: FileChunk.decode(reader, reader.uint32()) };
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.response = { $case: "metadata", metadata: FileMetadata.decode(reader, reader.uint32()) };
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): FileResponse {
    return {
      response: isSet(object.chunk)
        ? { $case: "chunk", chunk: FileChunk.fromJSON(object.chunk) }
        : isSet(object.metadata)
        ? { $case: "metadata", metadata: FileMetadata.fromJSON(object.metadata) }
        : undefined,
    };
  },

  toJSON(message: FileResponse): unknown {
    const obj: any = {};
    if (message.response?.$case === "chunk") {
      obj.chunk = FileChunk.toJSON(message.response.chunk);
    }
    if (message.response?.$case === "metadata") {
      obj.metadata = FileMetadata.toJSON(message.response.metadata);
    }
    return obj;
  },
};

function createBaseFileChunk(): FileChunk {
  return { chunkData: new Uint8Array(0) };
}

export const FileChunk = {
  encode(message: FileChunk, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.chunkData.length !== 0) {
      writer.uint32(10).bytes(message.chunkData);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): FileChunk {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFileChunk();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.chunkData = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): FileChunk {
    return { chunkData: isSet(object.chunkData) ? bytesFromBase64(object.chunkData) : new Uint8Array(0) };
  },

  toJSON(message: FileChunk): unknown {
    const obj: any = {};
    if (message.chunkData.length !== 0) {
      obj.chunkData = base64FromBytes(message.chunkData);
    }
    return obj;
  },
};

function createBaseFileMetadata(): FileMetadata {
  return { filename: "", mimeType: "", fileSize: 0 };
}

export const FileMetadata = {
  encode(message: FileMetadata, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.filename !== "") {
      writer.uint32(10).string(message.filename);
    }
    if (message.mimeType !== "") {
      writer.uint32(18).string(message.mimeType);
    }
    if (message.fileSize !== 0) {
      writer.uint32(24).uint64(message.fileSize);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): FileMetadata {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFileMetadata();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.filename = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.mimeType = reader.string();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.fileSize = longToNumber(reader.uint64() as Long);
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): FileMetadata {
    return {
      filename: isSet(object.filename) ? globalThis.String(object.filename) : "",
      mimeType: isSet(object.mimeType) ? globalThis.String(object.mimeType) : "",
      fileSize: isSet(object.fileSize) ? globalThis.Number(object.fileSize) : 0,
    };
  },

  toJSON(message: FileMetadata): unknown {
    const obj: any = {};
    if (message.filename !== "") {
      obj.filename = message.filename;
    }
    if (message.mimeType !== "") {
      obj.mimeType = message.mimeType;
    }
    if (message.fileSize !== 0) {
      obj.fileSize = Math.round(message.fileSize);
    }
    return obj;
  },
};

export type FileServiceDefinition = typeof FileServiceDefinition;
export const FileServiceDefinition = {
  name: "FileService",
  fullName: "filestream.FileService",
  methods: {
    getFile: {
      name: "GetFile",
      requestType: FileRequest,
      requestStream: false,
      responseType: FileResponse,
      responseStream: true,
      options: {},
    },
    add: {
      name: "Add",
      requestType: AddRequest,
      requestStream: false,
      responseType: AddResult,
      responseStream: false,
      options: {},
    },
  },
} as const;

export interface FileServiceImplementation<CallContextExt = {}> {
  getFile(request: FileRequest, context: CallContext & CallContextExt): ServerStreamingMethodResult<FileResponse>;
  add(request: AddRequest, context: CallContext & CallContextExt): Promise<AddResult>;
}

export interface FileServiceClient<CallOptionsExt = {}> {
  getFile(request: FileRequest, options?: CallOptions & CallOptionsExt): AsyncIterable<FileResponse>;
  add(request: AddRequest, options?: CallOptions & CallOptionsExt): Promise<AddResult>;
}

function bytesFromBase64(b64: string): Uint8Array {
  if (globalThis.Buffer) {
    return Uint8Array.from(globalThis.Buffer.from(b64, "base64"));
  } else {
    const bin = globalThis.atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; ++i) {
      arr[i] = bin.charCodeAt(i);
    }
    return arr;
  }
}

function base64FromBytes(arr: Uint8Array): string {
  if (globalThis.Buffer) {
    return globalThis.Buffer.from(arr).toString("base64");
  } else {
    const bin: string[] = [];
    arr.forEach((byte) => {
      bin.push(globalThis.String.fromCharCode(byte));
    });
    return globalThis.btoa(bin.join(""));
  }
}

function longToNumber(long: Long): number {
  if (long.gt(globalThis.Number.MAX_SAFE_INTEGER)) {
    throw new globalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
  }
  return long.toNumber();
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}

export type ServerStreamingMethodResult<Response> = { [Symbol.asyncIterator](): AsyncIterator<Response, void> };
