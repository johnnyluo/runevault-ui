import React, { useState, useContext } from 'react'

import WalletConnect from "@trustwallet/walletconnect";
import WalletConnectQRCodeModal from "@walletconnect/qrcode-modal";

import { Icon, Button, Text, Center } from '../../Components'
import { Icon as AntIcon, Row, Col, message } from 'antd'

import { Context } from '../../../context'
import { ledger, crypto } from '@binance-chain/javascript-sdk'


const WalletConnectPane = props => {

  const context = useContext(Context)
  const [connecting, setConnecting] = useState(false)

  const walletConnect = async () => {

    const walletConnector = new WalletConnect({
      bridge: "https://bridge.walletconnect.org" // Required
    });

    // Check if connection is already established
    if (!walletConnector.connected) {
      // create new session
      walletConnector.createSession().then(() => {
        // get uri for QR Code modal
        const uri = walletConnector.uri;
        // display QR Code modal
        WalletConnectQRCodeModal.open(uri, () => {
          console.log("QR Code Modal closed");
        })
      })
    }

    // Subscribe to connection events
    walletConnector.on("connect", (error, payload) => {
      if (error) {
        throw error;
      }

      // Close QR Code Modal
      WalletConnectQRCodeModal.close();

      // Get provided accounts and chainId
      const { accounts, chainId } = payload.params[0];

      walletConnector.getAccounts().then(result => {
        // Returns the accounts
        result.forEach(r => {
          if(r.network == 714) {
            console.log("WALLET CONNECT ACCOUNTS RESULTS " + r.address);

            context.setContext({
              "wallet": {
                "address": r.address,
              }
            }, () => {
              props.history.push("/stake")
            })

          }
        })

      })
      .catch(error => {
        // Error returned when rejected
        console.error(error);
      })
    })

    walletConnector.on("session_update", (error, payload) => {
      if (error) {
        throw error;
      }

      // Get updated accounts and chainId
      const { accounts, chainId } = payload.params[0];
    })

    walletConnector.on("disconnect", (error, payload) => {
      if (error) {
        throw error;
      }

      // Delete walletConnector
    })

  }


    const paneStyle = {
      backgroundColor: "#48515D",
      marginLeft: "10px",
      marginRight: "10px",
      marginTop: "50px",
      borderRadius: 5,
      boxShadow: "5px 5px 5px #50E3C2;",
    }

    return (
      <div>


        <Row  style={{bottom: 5}}>
          <Text size={18}>Click to scan a QR code and link your mobile wallet using WalletConnect.</Text>
        </Row>

        <Row>
          <Col  xs={24} md={3}></Col>
          <Col  xs={24} md={8} style={paneStyle}>

            <a>
              <Center><Icon icon="qrcode" style={{width:200, marginTop:30, marginBottom:30}} onClick={() => walletConnect()} /></Center>
            </a>
          </Col>
          <Col xs={24} md={13}></Col>
        </Row>


      </div>
    )
  }

  export default WalletConnectPane
