## Running

```bash
# To run using real API communicator
cat ./test/assets/example1-data.csv | npm start

# To run using mock API communicator
cat ./test/assets/example1-data.csv | npm start-dev

# To run tests
npm test
```

## Overall Architecture
This sample is written in Node.js and tested with Jest. I chose these because I am currently most familiar with JavaScript and with Jest, though this is actually my first project with Node.js. 

The functionality is split as follows:
- Main application entry
- API Communicators
- Services
- Models

## Class Descriptions
| Class | Description |
|---|---|
| `AppEntry` | Main application entry. Handles primary input, calling services, and output. |
| `AddressValidatorService` | A service that handles building a validated address string for a given address by calling out to Address Validator API and using its response. Includes deciding which API communicator to use. |
| `AddressesFileParserService` | A service that handles parsing a given file containing lines of addresses. |
| `Address` | A model representing an address. Specific to the US. Only contains fields required for this project, not all possible address fields. |
| `AddressesFile` | A model representing the data expected to be found in a file containing lines of addresses. Contains some logic for using this data. |
| `AddressValidatorParams` | A model representing the data structures for input to and output from the Address Validator API. Contains some logic for using this data. |

## Decisions & Assumptions

### Somewhat Heavy AppEntry
The AppEntry module *could* have been split out into yet another service, particularly based on how light most of the other classes were. However, doing so required a gnarled mess of promises that made the code much more difficult to read. I chose to keep more functionality in AppEntry in order to increase the readability of the code.

### Fixed file header order
The instructions were not specific about whether we could rely on the CSV file to have a fixed order to its fields or whether we should build in order flexibility. Given this, I decided to implement a fixed file order, which was a common expectation/assumption when I previously did integrations architecture (including file-based). It significantly reduces complexity in implementation, so unless field order flexibility is a requirement of a project, I tend to opt for fixed.

### Mock API Communicator
Because the Address Validator API had limits on the number of results you could get for a single API key, I implemented a mock communicator that could be used during development and testing. There are tests to ensure that this mock is accurate to its real counterpart, specifically in terms of the response keys that it returns.

There is an environment variable that controls which communicator (real or mock) is used; this variable differs between the `.env.dev` and `.env.prod` files

### Environment Variables
I chose to put a small number of variables in `.env` files rather than directly in a JS config object to simulate what a more likely setup would be in production for values that are sensitive (like a key) and/or might need to change quickly.

### Building With Constant Keys
To build in the ability to more easily extend this code base, I utilized a significant number of constants as keys throughout. This felt particularly important for the request and response parameter keys for the Address Validator API, the keys/fields for an address, and the fields expected in a file containing lines of addresses. All three of these things are likely to change, some of them likely to change unexpectedly and therefore cause a production failure (such is the nature of APIs and file integrations). Building functionality and tests using these constant keys should allow for quicker and less-risky updates.

### Asset testing
I captured responses from the real and mock Address Validator API for all 3 status types and saved them as asset files for testing purposes. To ensure that we are always staying in sync with the real API responses, I included tests (`assets-test.js`) to validate the assets still match the real API (except for some fields that change with each request).

### Only High-level AppEntry Testing
When I started building out tests for each of the AppEntry methods, each method really required calling one or more of the others in order to properly test the method. Given this, I decided that testing the functionality as a whole also gave us enough confidence about each of the containing methods for this project and just left it at that.