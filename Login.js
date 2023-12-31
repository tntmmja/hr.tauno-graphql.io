//functions for login page functionality
//renders the login form on the DOM
function renderLoginPage() {
  const data = `
  <div class="userauth">
    <form onsubmit="handleLoginSubmit(event)" class="userauthForm">
    <h2>Log in</h2>
    <div class="formGroup">
      <label>
        Username:
        <br />
        <input
          type="text"
          id="login_username"
          name="username"
          placeholder="Enter username or email"
          autocomplete="on"
        />
      </label>
    </div>
    <div class="formGroup">
      <label>
        Password:
        <br />
        <input
          type="password"
          id="login_password"
          name="password"
          placeholder="Enter password"
          required
          autocomplete="on"
        />
      </label>
    </div>
    <button type="submit">Log in</button>
    </form>
  </div>`;
  document.querySelector('.pageContent').innerHTML = data;
}

// // submit handler for login form
// // sends user data to the server
// async function handleLoginSubmit(event) {
//     event.preventDefault();
//     var username = event.target.login_username.value+"";
//     var password = event.target.login_password.value+"";
//     var headers = await login(username, password);
//     var data = await fetchUserData(headers);
//     if (data.errors) {
//       // Handle errors here
//       console.log(data.errors);
//     } else {
//     // //if only login name has to be displayed then next row is the last
//     //   generateServerResponse(data.data.user[0].login);
//     var userLogin = data.data.user[0].login;
//     var userId = data.data.user[0].id;
//     var xpData = await fetchUserXP(headers, userId);
//     if (xpData.errors) {
//       // Handle errors here
//       console.log(xpData.errors);
//     } else {
//         generateServerResponse(userLogin, xpData.data.transaction_aggregate.aggregate.sum.amount);
//     }
//     }
//   }

async function handleLoginSubmit(event) {
  event.preventDefault();
  var username = event.target.login_username.value+"";
  var password = event.target.login_password.value+"";
  try {
    await login(username, password);
    var data = await fetchUserData();
    if (data.errors) {
      console.log("handleLoginSubmit error: ", data.errors);
    } else {
      var userLogin = data.data.user[0].login;
      var userId = data.data.user[0].id;
      var xpData = await fetchUserXP();
      var auditData = await fetchUserAuditRatio();
      if (xpData.errors || auditData == null) {
        console.log(xpData.errors);
      } else {
        generateServerResponse(userLogin, customRound(xpData.data.transaction_aggregate.aggregate.sum.amount / 1000), auditData);
      }
    }
  } catch (error) {
    // Display the error message on the page.
    document.querySelector('.pageContent').innerHTML += `<p class="error">${error.message}</p>`;
  }
}
function generateServerResponse(login, xpSum, auditData, chartData) {
  const pageContent = document.querySelector('.pageContent');
  pageContent.innerHTML = `
      <p>Welcome, ${login}.</p>
      <button onclick="handleLogout()">Logout</button>
      <div>Your total XP: ${xpSum}kb.</div>
      <div class="auditData">
          <div>XP from audits made: ${auditData.auditMade}kb.</div>
          <div>XP from audits received: ${auditData.auditReceived}kb.</div>
          <div>Audit Ratio: ${auditData.ratio.toFixed(2)}</div>
      </div>
    
      <div id="barChart"></div>
      <div id="lineGraph"></div>
  `;

  sendQuery(XpPerName)
  .then(data => {
  if (!data || !data.transaction) {
      console.error('Error: data or data.transaction is undefined:', data);
      return;
  }
  Visualizations.generateBarChart(data.transaction);
  Visualizations.generateLineGraph(data.transaction);
  })
  .catch(error => {
    console.error('Error:', error);
  });
}
function handleLogout() {
// Do logout action here. This is usually done by deleting the JWT stored in the browser.
renderLoginPage();
}
async function login(username, password) {
  console.log("starting login");
  window.headers = new Headers();
  headers.set('Authorization', 'Basic ' + btoa(username + ":" + password));
  headers.set('Content-Type', 'application/json');
  var response = await fetch("https://01.kood.tech/api/auth/signin", {
      method: "POST",
      headers: headers,
  });
  if (!response.ok) {
    throw new Error('Invalid login credentials');
  }
  var jwt = await response.json();
  headers.set('Authorization', 'Bearer ' + jwt);
}
