var extclientid = '';
var extclientsecret = '';
var authUrl = '';
var tokurl = '';
var rediruri = '';
var tokenFormat = OAuth2.TOKEN_FORMAT.JSON;

function getMiroService() {
  // Create a new service with the given name. The name will be used when
  // persisting the authorized token, so ensure it is unique within the
  // scope of the property store.
  return OAuth2.createService('miro')

      // Set the endpoint URLs, which are the same for all Google services.
      .setAuthorizationBaseUrl(authUrl)
      .setTokenUrl(tokurl)

      // Set the client ID and secret, from the Google Developers Console.
      .setClientId(extclientid)
      .setClientSecret(extclientsecret)

      // Set the name of the callback function in the script referenced
      // above that should be invoked to complete the OAuth flow.
      .setCallbackFunction('authCallback')

      // Set the property store where authorized tokens should be persisted.
      .setPropertyStore(PropertiesService.getUserProperties())

      // Set the scopes to request (space-separated for Google services).
      .setScope('boards:read boards:write')

}

function authCallback(request) {
  var isAuthorized = handleCallback2(request);
  if (isAuthorized) {
    return HtmlService.createHtmlOutput('Success! You can close this tab.');
  } else {
    return HtmlService.createHtmlOutput('Denied. You can close this tab');
  }
}


function handleCallback2(callbackRequest){
  var miroService = getMiroService();
  var code = callbackRequest.parameter.code;
  var error = callbackRequest.parameter.error;
  if (error) {
    if (error == 'access_denied') {
      return false;
    } else {
      throw new Error('Error authorizing token: ' + error);
    }
  }

  var payload = {
    code: code,
    client_id: extclientid,
    client_secret: extclientsecret,
    redirect_uri: rediruri,
    grant_type: 'authorization_code'
  };

  var token = fetchToken(payload);
  Logger.log("token");
  Logger.log(token);
  saveToken(token);
  return true;
}

function fetchToken (payload) {
   var miroService = getMiroService();
 // Use the configured token URL unless one is specified.
  var url = tokurl;
  var headers = {
    'Accept': tokenFormat,
    'Authorization' : 'Bearer LWL4xvgQguL_i7FWxQpxYMUpv7U'
  };

  var new_url = url.addQuery(payload);
  Logger.log("url");
  Logger.log(new_url);
  var response = UrlFetchApp.fetch(new_url, {
    method: 'POST',
    headers: headers,
    muteHttpExceptions: true
  });
  return getTokenFromResponse(response);
}

function getTokenFromResponse (response) {
  Logger.log("response");
  Logger.log(response);
  var token = parseToken(response.getContentText());
  var resCode = response.getResponseCode();
  if ( resCode < 200 || resCode >= 300 || token.error) {
    var reason = [
      token.error,
      token.message,
      token.error_description,
      token.error_uri
    ].filter(Boolean).map(function(part) {
      return typeof(part) == 'string' ? part : JSON.stringify(part);
    }).join(', ');
    if (!reason) {
      reason = resCode + ': ' + JSON.stringify(token);
    }
    throw new Error('Error retrieving token: ' + reason);
  }
  return token;
};

function parseToken (content) {
  var token;
  try {
    token = JSON.parse(content);
  } catch (e) {
    throw new Error('Token response not valid JSON: ' + e);
  }
  token.granted_time = getTimeInSeconds(new Date());
  return token;
}

function saveToken (token) {
  var miroService = getMiroService();
  miroService.getStorage().setValue(null, token);
};

function showSidebar() {
  var miroService = getMiroService();
  if (!miroService.hasAccess()) {
    var authorizationUrl = miroService.getAuthorizationUrl();
    var output = buildHTML("<p>Request Access to Miro</p><br><a class='button' target='_blank' href='"+authorizationUrl+"' onclick='google.script.host.close()' >Authorize</a>");
    showAlert(output);
  } else {
    var output = buildHTML("<p>You already have access.</p><p>You can proceed to execute the script clicking on Build Miro</p> <img  width='50%' src='https://drive.google.com/uc?export=view&id=1OD27-ylxe-CDc158GAqQCgvaYCFxGhJy'>");
    showAlert(output);
  }
}