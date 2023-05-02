/**
 * This program and the accompanying materials are made available under the terms of the
 * Eclipse Public License v2.0 which accompanies this distribution, and is available at
 * https://www.eclipse.org/legal/epl-v20.html
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Copyright Contributors to the Zowe Project.
 *
 */

import { mockHandlerParameters } from "@zowe/cli-test-utils";
import { CommandProfiles, IHandlerParameters, IProfile, Session } from "@zowe/imperative";
import { ICMCIApiResponse } from "../../../../src";
import { UrimapDefinition } from "../../../../src/cli/discard/urimap/Urimap.definition";
import UrimapHandler from "../../../../src/cli/discard/urimap/Urimap.handler";

jest.mock("@zowe/cics-for-zowe-sdk");
const Discard = require("@zowe/cics-for-zowe-sdk");

const host = "somewhere.com";
const port = "43443";
const user = "someone";
const password = "somesecret";
const protocol = "http";
const rejectUnauthorized = false;

const PROFILE_MAP = new Map<string, IProfile[]>();
PROFILE_MAP.set(
  "cics", [{
    name: "cics",
    type: "cics",
    host,
    port,
    user,
    password,
    protocol,
    rejectUnauthorized
  }]
);
const PROFILES: CommandProfiles = new CommandProfiles(PROFILE_MAP);
const DEFAULT_PARAMETERS: IHandlerParameters = mockHandlerParameters({
  positionals: ["cics", "discard", "urimap"],
  definition: UrimapDefinition,
  profiles: PROFILES
});

describe("DiscardUrimapHandler", () => {
  const urimapName = "testUrimap";
  const regionName = "testRegion";

  const defaultReturn: ICMCIApiResponse = {
    response: {
      resultsummary: {api_response1: "1024", api_response2: "0", recordcount: "0", displayed_recordcount: "0"},
      records: "testing"
    }
  };

  const functionSpy = jest.spyOn(Discard, "discardUrimap");

  beforeEach(() => {
    functionSpy.mockClear();
    functionSpy.mockImplementation(async () => defaultReturn);
  });

  it("should call the discardUrimap api", async () => {
    const handler = new UrimapHandler();

    const commandParameters = {...DEFAULT_PARAMETERS};
    commandParameters.arguments = {
      ...commandParameters.arguments,
      urimapName,
      regionName,
      host,
      port,
      user,
      password,
      protocol,
      rejectUnauthorized
    };

    await handler.process(commandParameters);

    expect(functionSpy).toHaveBeenCalledTimes(1);
    const testProfile = PROFILE_MAP.get("cics")[0];
    expect(functionSpy).toHaveBeenCalledWith(
      new Session({
        type: "basic",
        hostname: testProfile.host,
        port: testProfile.port,
        user: testProfile.user,
        password: testProfile.password,
        rejectUnauthorized,
        protocol
      }),
      {
        name: urimapName,
        regionName
      }
    );
  });
});
