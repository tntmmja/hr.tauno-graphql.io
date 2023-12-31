/*
{
  user {
    firstName
    lastName
    xps {
      event {
        id
        objectId
      }
      amount
    }
  }
  progress {
    grade
  }
}
{
  user {
    firstName
    lastName
    xps {
      event {
        id
        usersRelation {
          
        }
      }
      amount
    }
  }
  progress {
    grade
  }
}
query {
  user {
    transactions (
      where: {
        _and: [{ object:{type:{_eq:"project"}}, type:{_eq:"xp"} }]
      	}
    ){
      object {
        type
      }
    	amount
      type
    	createdAt
    	path
      }
  }
}
// 06/07/2023
query transactionQuery {
  transaction(
    where: {
      _and: [
        {
          type: {
            _eq: "down"
          }
        }, 
        {
          user: {
            login: {
              _eq: "asdfguy"
            }
          }
        }
      ]
    }
  ) {
    object {
      name
    }
    createdAt
    //"xp" - project
    //"up"/"down" - audits, one is audits you have made, the other is audits others have made for your project. Not sure which is which.
    type
    
    amount
  }
}
query progressQuery {
  progress {
    isDone
  }
}
06/07/2023
query progressQuery {
  user {
    progresses(
      where: {_and: [{isDone: {_eq: true}}, {object: {type: {_eq: "piscine"}}}]}
    ) {
      createdAt
      isDone
      path
      object {
        type
        id
      }
    }
  }
}
query transactionQuery {
  transaction
  (where: {
    _and: [
      {object: {type: {_eq: "project"}}},
      {type: {_eq: "xp"}},
      {object: {name: {_eq: "go-reloaded"}}}
    ]
    
  	}
  )
  {
    object {
      type
    }
    createdAt
    amount
    path
    type
    eventId
  }
}
query piscineXP {
  transaction(
    where: {
      _and: [
        { object: { type: { _eq: "piscine" } } },
        { type: { _eq: "xp" } }
      ]
    }
  ) {
    object {
      type
      id
    }
    createdAt
    amount
    path
    type
  }
}
//gives all done quests
query projectsQuery {
  transaction
  (where: {
    _and: [
      {object: {type: {_eq: "project"}}},
      {type: {_eq: "xp"}},
      {eventId: {_eq: 20}},
    ]
    
  	}
  )
  {
    object {
      type
    }
    createdAt
    amount
    path
    type
    eventId
  }
}
//gets the xp for "up" audits
query upAudits {
  transaction(
    where: {
      _and: [
        {object: {type: {_eq: "project"}}}, 
        {type: {_eq: "up"}}, 
        {eventId: {_eq: 20}}]
    }
  ) {
    object {
      type
    }
    createdAt
    path
    amount
    type
    eventId
  }
}
*/
const userQuery = `{
  user { 
    id 
    login
    firstName
    lastName
	}
}`
const userXpQuery = `{
  transaction_aggregate(
    where: {
      _and: [
        {
          _or: [
            {object: {type: {_eq: "project"}}},
            {object: {type: {_eq: "piscine"}}},
          ]
        }, 
        {type: {_eq: "xp"}}, 
        {eventId: {_eq: 20}}]
    }
  ) {
    aggregate {
      sum {
        amount
      }
    }
  }
}`
const userUpXpQuery = `{
  transaction_aggregate(
    where: {
      _and: [
        {
          _or: [
            {object: {type: {_eq: "project"}}},
            {object: {type: {_eq: "piscine"}}},
          ]
        }, 
        {type: {_eq: "up"}}, 
        {eventId: {_eq: 20}}]
    }
  ) {
    aggregate {
      sum {
        amount
      }
    }
  }
}`
const userDownXpQuery = `{
  transaction_aggregate(
    where: {
      _and: [
        {
          _or: [
            {object: {type: {_eq: "project"}}},
            {object: {type: {_eq: "piscine"}}},
          ]
        }, 
        {type: {_eq: "down"}}, 
        {eventId: {_eq: 20}}]
    }
  ) {
    aggregate {
      sum {
        amount
      }
    }
  }
}`
const XpPerName = `{
  transaction(
    where: {
      _and: [
        {
          _or: [
            {object: {type: {_eq: "project"}}},
            {object: {type: {_eq: "piscine"}}},
          ]
        }, 
        {type: {_eq: "xp"}},
        {eventId: {_eq: 20}},
      ]
    }, 
    order_by: {
      createdAt:asc
    }
  ) {
    object {
      name
    }
    createdAt
    amount
    type
  }
}`
// Fetch API to interact with GraphQL server.
async function sendQuery(query) {
  return fetch("https://01.kood.tech/api/graphql-engine/v1/graphql", {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
          query: query,
      })
  })
  .then(response => {
      if (response.ok) {
          return response.json();
      } else {
          throw new Error('Network response in sendQuery was not ok.');
      }
  })
  .then(data => {
      return data.data; // We're interested in the 'data' field of the response
  });
}