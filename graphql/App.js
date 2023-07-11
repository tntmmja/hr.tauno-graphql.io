async function fetchUserData() {
  const data = await fetch("https://01.kood.tech/api/graphql-engine/v1/graphql", {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
          query: userQuery,
      }),
  })
  .then((res) => {return res.json()});
  
  return data;
}
// Fetch the sum of XP for a user
async function fetchUserXP() {
  return fetch("https://01.kood.tech/api/graphql-engine/v1/graphql", {
    method: "POST",
    headers: headers,
    body: JSON.stringify({
      query: userXpQuery,
    }),
  })
  .then((res) => {return res.json()})
}
async function fetchUserUpTransactions() {
  return fetch("https://01.kood.tech/api/graphql-engine/v1/graphql", {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
          query: userUpXpQuery,
      }),
  })
  .then((res) => {return res.json()})
}
async function fetchUserDownTransactions() {
  return fetch("https://01.kood.tech/api/graphql-engine/v1/graphql", {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
          query: userDownXpQuery,
      }),
  })
  .then((res) => {return res.json()})
}
async function fetchUserAuditRatio() {
  const upTransactions = await fetchUserUpTransactions();
  const downTransactions = await fetchUserDownTransactions();
  if (!upTransactions.errors && !downTransactions.errors) {
      const auditMade = customRound(upTransactions.data.transaction_aggregate.aggregate.sum.amount / 1000);
      const auditReceived = customRound(downTransactions.data.transaction_aggregate.aggregate.sum.amount / 1000);
      const ratio = auditMade / auditReceived;
      return { auditMade, auditReceived, ratio };
  } else {
      return null;
  }
}
function customRound(num) {
  return Math.round((num + Number.EPSILON) * 1) / 1
}