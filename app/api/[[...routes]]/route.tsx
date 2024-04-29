/** @jsxImportSource frog/jsx */
import { Button, Frog, TextInput } from 'frog'
import { devtools } from 'frog/dev'
import { CovalentClient } from "@covalenthq/client-sdk";
import { NeynarAPIClient } from "@neynar/nodejs-sdk";
import { handle } from 'frog/next'
import { serveStatic } from 'frog/serve-static'
import {ethers} from 'ethers';
//import { useState } from 'react'
const app = new Frog({
  assetsPath: '/',
  basePath: '/api',
})
let chain = "";
let address = "";

// Uncomment to use Edge Runtime
// export const runtime = 'edge'

app.frame('/', (c) => {
  const { buttonValue, inputText, status } = c
  const fruit = inputText || buttonValue
  return c.res({
    action: '/submit',
    image: (
      <div
        style={{
          alignItems: 'center',
          background:'hsla(265, 53%, 29%, 1)',
          backgroundSize: '100% 100%',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          height: '100%',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <div
          style={{
            color: '#e36414 ',
            fontSize: 60,
            fontStyle: 'normal',
            letterSpacing: '-0.025em',
            lineHeight: 1.4,
            marginTop: 30,
            padding: '0 120px',
            whiteSpace: 'pre-wrap',
          }}
        > Do you remember your Token Approvals anon 👀 ? Find it here ⬇️
        </div>
      </div>
    ),
    intents: [
      <TextInput placeholder="Enter your wallet address..." />,
      <Button value="eth">Ethereum</Button>,
      <Button value="scroll">Scroll</Button>,
      <Button value="base">Base</Button>
    ],
  })
})


app.frame('/submit', async (c) => {
  const { buttonValue } = c
  const client = new CovalentClient(`${process.env.COVALENT_KEY}`);
 // setAddress(`${c.inputText}`);
  const neynar_client = new NeynarAPIClient(`${process.env.NEYNAR_API_KEY}`);
  //can do for eth pol base scroll
let tokens:any = [];
let spenders:any = [];
  let total = 0;

  try{
  if (buttonValue === "eth") {
    const resp = await client.SecurityService.getApprovals("eth-mainnet",`${c.inputText}`);
    let items = (resp.data.items);
    chain = "eth";
    address = `${c.inputText}`;
    items.map((item) => {
      let ticker = item.ticker_symbol;
      tokens.push(ticker);
      let spender = (item.spenders).length;
      spenders.push(spender);
      total += Number(item.value_at_risk);
    })
    let ether = await ethers.utils.formatEther(total.toString());
    total = Number(ether);
    } else if (buttonValue === "scroll") {
    chain = "scroll";
    address = `${c.inputText}`;

    const resp = await client.SecurityService.getApprovals("scroll-mainnet",`${c.inputText}`);
    let items = (resp.data.items);
    items.map((item) => {
      let ticker = item.ticker_symbol;
      tokens.push(ticker);
      let spender = (item.spenders).length;
      spenders.push(spender);
      total += Number(item.value_at_risk);
    })
    let ether = await ethers.utils.formatEther(total.toString());
    total = Number(ether);

  }
    else if (buttonValue == "base") {
    chain = "base";
    address = `${c.inputText}`;

      const resp = await client.SecurityService.getApprovals("base-mainnet",`${c.inputText}`);
    let items = (resp.data.items);
    items.map((item) => {
      console.log("Item : ",item);
      let ticker = item.ticker_symbol;
      tokens.push(ticker);
      let spender = (item.spenders).length;
      spenders.push(spender);
      total += Number(item.value_at_risk);
    })
 //   setChain("base");
    let ether = ethers.utils.formatEther(total.toString());
    total = Number(ether);

  }
}catch(e){
  return c.res({
    action:'/nft',
    image: ( 
      <div
        style={{
          alignItems: 'center',
          background:
            'hsla(265, 53%, 29%, 1)',
          backgroundSize: '100% 100%',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          height: '100%',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <span
          style={{
            color: '#e36414',
            fontSize: 60,
            fontStyle: 'italic',
            letterSpacing: '-0.025em',
            lineHeight: 1.4,
            marginTop: 30,
            padding: '0 120px',
            whiteSpace: 'pre-wrap',
          }}
        >
          No Activity found on this chain !
        </span>

        </div>
        ),
       intents:[
        <Button value='go'>Go Back</Button >
       ]
  })
}
  try{
  const user = await neynar_client.lookupUserByVerification(c.inputText as any);
  return c.res({
    action:'/nft',
    image: (
      <div
        style={{
          alignItems: 'center',
          background:
            'hsla(265, 53%, 29%, 1)',
          backgroundSize: '100% 100%',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          height: '100%',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
        }}
      >
               <span
               style={{
                 color: '#e36414',
                 fontSize: 60,
                 fontStyle: 'normal',
                 letterSpacing: '-0.025em',
                 lineHeight: 1.4,
                 marginTop: 30,
                 padding: '0 120px',
                 whiteSpace: 'pre-wrap',
               }}
             >
               {user.result.user.displayName}'s stats
             </span>
        <span
          style={{
            color: 'white',
            fontSize: 60,
            fontStyle: 'normal',
            letterSpacing: '-0.025em',
            lineHeight: 1.4,
            marginTop: 30,
            padding: '0 120px',
            whiteSpace: 'pre-wrap',
          }}
        >
          Ethers at risk  : {total.toFixed(4)} ETH
        </span>
        <span
          style={{
            color: 'white',
            fontSize: 60,
            fontStyle: 'normal',
            letterSpacing: '-0.025em',
            lineHeight: 1.4,
            marginTop: 30,
            padding: '0 120px',
            whiteSpace: 'pre-wrap',
          }}
        >
          Tokens at risk  : {tokens.join(", ")}
        </span>

        <span
          style={{
            color: 'white',
            fontSize: 60,
            fontStyle: 'normal',
            letterSpacing: '-0.025em',
            lineHeight: 1.4,
            marginTop: 30,
            padding: '0 120px',
            whiteSpace: 'pre-wrap',
          }}
        >
          Spenders : {spenders.join(", ")}
        </span>
      </div>
    ),
    intents: [
      <Button >Check NFT Approvals</Button>,
    ]

  })

}catch(e){

}
})

app.frame('/nft', async (c) => {
  const { buttonValue } = c
  const client = new CovalentClient(`${process.env.COVALENT_KEY}`);
  const neynar_client = new NeynarAPIClient(`${process.env.NEYNAR_API_KEY}`);
  //can do for eth pol base OP
let tokens:any = [];
let spenders:any = [];
  let total = 0;
  try{
  if (chain === "eth") {
    const resp = await client.SecurityService.getNftApprovals("eth-mainnet",address);
   console.log("Response : ",resp.data.items);
   chain = " ";
    let items = (resp.data.items);
    if(items.length != 0){
      items.map((item) => {
        console.log("Item Balance: ",item.token_balances.length);
        if(item.token_balances.length != 0){
        let ticker = item.contract_address_label;
        tokens.push(ticker);
        let spender = (item.spenders).length;
        spenders.push(spender);
        }
      })
    }else{
      throw new Error("No Activity found on this chain");
    }
    } else if (chain === "scroll") {
    const resp = await client.SecurityService.getNftApprovals("scroll-mainnet",address);
    chain = " ";
   
    let items = (resp.data.items);
    if(items.length != 0){
      items.map((item) => {
        console.log("Item Balance: ",item.token_balances.length);
        if(item.token_balances.length != 0){
        let ticker = item.contract_address_label;
        tokens.push(ticker);
        let spender = (item.spenders).length;
        spenders.push(spender);
        }
      })
    }else{
      throw new Error("No Activity found on this chain");
    }
  }
    else if (chain == "base") {
      console.log("Addr",address);
   chain = " ";

      const resp = await client.SecurityService.getNftApprovals("base-mainnet",address);
      let items = (resp.data.items);
      if(items.length != 0){
        items.map((item) => {
          console.log("Item Balance: ",item.token_balances.length);
          if(item.token_balances.length != 0){
          let ticker = item.contract_address_label;
          tokens.push(ticker);
          let spender = (item.spenders).length;
          spenders.push(spender);
          }
        })
      }else{
        throw new Error("No Activity found on this chain");
      }
  }
}catch(e){
  return c.res({
    image: ( 
      <div
        style={{
          alignItems: 'center',
          background:
            'hsla(265, 53%, 29%, 1)',
          backgroundSize: '100% 100%',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          height: '100%',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <span
          style={{
            color: '#e36414',
            fontSize: 60,
            fontStyle: 'italic',
            letterSpacing: '-0.025em',
            lineHeight: 1.4,
            marginTop: 30,
            padding: '0 120px',
            whiteSpace: 'pre-wrap',
          }}
        >
          No Activity found on this chain !
        </span>

        </div>
        ),
       intents:[
        <Button.Reset>Go Back</Button.Reset>
       ]
  })
}
  try{
  const user = await neynar_client.lookupUserByVerification(address as any);
  return c.res({
    image: (
      <div
        style={{
          alignItems: 'center',
          background:
            'hsla(265, 53%, 29%, 1)',
          backgroundSize: '100% 100%',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          height: '100%',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
        }}
      >
               <span
               style={{
                 color: '#e36414',
                 fontSize: 60,
                 fontStyle: 'normal',
                 letterSpacing: '-0.025em',
                 lineHeight: 1.4,
                 marginTop: 30,
                 padding: '0 120px',
                 whiteSpace: 'pre-wrap',
               }}
             >
               {user.result.user.displayName}'s NFT stats
             </span>
        <span
          style={{
            color: 'white',
            fontSize: 60,
            fontStyle: 'normal',
            letterSpacing: '-0.025em',
            lineHeight: 1.4,
            marginTop: 30,
            padding: '0 120px',
            whiteSpace: 'pre-wrap',
          }}
        >
          Total NFTs at risk  : {tokens.length}
        </span>
        <span
          style={{
            color: 'white',
            fontSize: 60,
            fontStyle: 'normal',
            letterSpacing: '-0.025em',
            lineHeight: 1.4,
            marginTop: 30,
            padding: '0 120px',
            whiteSpace: 'pre-wrap',
          }}
        >
          NFTs : {tokens.join(", ")}
        </span>

        <span
          style={{
            color: 'white',
            fontSize: 60,
            fontStyle: 'normal',
            letterSpacing: '-0.025em',
            lineHeight: 1.4,
            marginTop: 30,
            padding: '0 120px',
            whiteSpace: 'pre-wrap',
          }}
        >
          Spenders : {spenders.join(", ")}
        </span>
      </div>
    ),
    intents: [
      <Button.Reset >Go Back</Button.Reset>,
    ]

  })

}catch(e){

}
})


devtools(app, { serveStatic })

export const GET = handle(app)
export const POST = handle(app)
