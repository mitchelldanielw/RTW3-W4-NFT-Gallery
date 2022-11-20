import Head from 'next/head'
import Image from 'next/image'
import { useState } from "react"
import { NFTCard } from "../components/nftCard"



export default function Home() {
  const [wallet, setWalletAddress] = useState("");
  const [collection, setCollectionAddress] = useState("");
  const [NFTs, setNFTs]= useState([]);
  const [fetchForCollection, setFetchForCollection]=useState(false);
  const [startToken, setStartToken] = useState("");
  const [pageKey, setPageKey]=useState("");

  const fetchNFTs = async() => {
    let nfts; 
    console.log("fetching nfts");
    const api_key = process.env.NEXT_PUBLIC_API_KEY;
    const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${api_key}/getNFTs/`;

    if (!collection.length)
      {var requestOptions = {
        method: 'GET'
      };
     
      const fetchURL = `${baseURL}?owner=${wallet}`;
  
      nfts = await fetch(fetchURL, requestOptions).then(data => data.json())
    } else {
      console.log("Fetching address owned NFTs collection:")
      const fetchURL= `${baseURL}?owner=${wallet}&contractAddresses%5B%5D=${collection}`;
      nfts= await fetch(fetchURL, requestOptions).then(data => data.json())
      if(pageKey ==''){
        fetchURL = `${baseURL}?owner=${wallet}&contractAddresses%5B%5D=${collection}`;
      
    }
    else{
      fetchURL = `${baseURL}?owner=${wallet}&contractAddresses%5B%5D=${collection}?pageKey=${pageKey}`;
    }
      nfts= await fetch(fetchURL, requestOptions).then(data => data.json())
    }
  
    if (nfts) {
      console.log("nfts:", nfts)  
      if(NFTs.length >0){
      setNFTs([...nfts.ownedNfts])
      }
      else{
        setNFTs(nfts.ownedNfts);
      }
      if(nfts.pageKey){
        setPageKey(nfts.pageKey);
      }
      else{
        setPageKey("");
      }
    }
  }
  
  const fetchNFTsForCollection = async () => {
    if (collection.length) {
      var requestOptions = {
        method: 'GET'
      };
      const api_key = process.env.NEXT_PUBLIC_API_KEY;
      const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${api_key}/getNFTsForCollection/`;
      const fetchURL = `${baseURL}?contractAddress=${collection}&withMetadata=${"true"}&startToken=${startToken}`;
      const nfts = await fetch(fetchURL, requestOptions).then(data => data.json())
      if (nfts) {
        console.log(nfts.nextToken)
        setNFTs("")
        if(nfts.nextToken){
          setStartToken(nfts.nextToken)
        }
        else{
          setStartToken("");
        }
        console.log(NFTs.length)
        console.log("NFTs in collection:", nfts)
        if(NFTs.length >0){
          setNFTs([...NFTs,...nfts.nfts])
        }else{
          setNFTs(nfts.nfts)
        }
        if(nfts.pageKey){
          setPageKey(nfts.pageKey);
        }
        else{
          setPageKey("");
        }
      }
    }
  }
  
  
  return (

  <div className="bgslate">
    <div className="bgslate flex flex-col items-center justify-center h-full">
      <div className="bgslate flex flex-col w-full justify-center items-center h-full">

        <a title="Alchemy Road to Web3 Week4" className="title text-center font-bold ..." target={"_blank"} href="https://docs.alchemy.com/docs/how-to-create-an-nft-gallery">RTW3 Week4 (NFT GALLERY)</a>

        <span className="span text-center font-bold ...">Utilizing Alchemy NFT API (Capable of fetching NFTs based on Wallet + or - Collection address)</span>

        <label className="label">
          <input disabled={fetchForCollection} title="Paste Wallet Address" className="input disabled:cursor-not-allowed" onChange={(e)=>{setWalletAddress(e.target.value)}} value={wallet} type={"text"} placeholder="Input or paste a wallet address here..."></input>
          <input type={"checkbox"} className="mt-2 ml-2 accent-indigo-700" onChange={(e)=>{setFetchForCollection(e.target.checked), (e.target.checked),setNFTs("")}}></input> ← Disable wallet address and search NFT collections only!
          <input title="Paste Collection Address" className="input" onChange={(e)=>{setCollectionAddress(e.target.value)}} value={collection} type={"text"} placeholder="Input a collection address here..."></input>
        </label>

        <button disabled={(NFTs.length>=100)} className={"disabled:bg-slate-900 mt-6 mb-6 text-white text-2xl justify-center bg-indigo-900 py-3 px-6 rounded-full"} title="Let's go!" onClick={
           () => {
            
            if (fetchForCollection) {

              fetchNFTsForCollection() //fetches collection...
            }else 
              fetchNFTs(); //fetches wallet collection or collection combo...
          }
        }> Discover NFTs! </button>
      </div>
  
      <div className="flex flex-wrap gap-y-6 mt-1 mb-1 w-5/6 gap-x-6 justify-center bgslate">
        {
          NFTs.length && NFTs.map((nft ,index) => {
            return (
              <NFTCard key={index} nft={nft} ></NFTCard>
              
            );
          })
        }
      </div>
      {startToken? 
          <button 
          className={"text-white btn"}
            onClick={
              () => {
                if (fetchForCollection) {
                  fetchNFTsForCollection() //fetches collection if collection only enabled...
                }else 
                  fetchNFTs(); //fetches wallet collection...
              }
            }
          >
            --- Click for more collection NFTs ---
          </button>
          : <></> }
    </div>
  </div>
  )
}