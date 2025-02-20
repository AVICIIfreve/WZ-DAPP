import { parseEther } from "viem";
import { Button, message } from "antd";
import {
  http,
  useReadContract,
  useWriteContract,
  useWatchContractEvent,
} from "wagmi";
import {
  Address,
  NFTCard,
  Connector,
  ConnectButton,
  useAccount,
} from "@ant-design/web3";
import {
  Mainnet,
  WagmiWeb3ConfigProvider,
  MetaMask,
} from "@ant-design/web3-wagmi";

const CallTest = () => {
  useWatchContractEvent({
    address: "0xEcd0D12E21805803f70de03B72B1C162dB0898d9",
    abi: [
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "address",
            name: "minter",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
        ],
        name: "Minted",
        type: "event",
      },
    ],
    eventName: "Minted",
    onLogs() {
      message.success("new minted!");
    },
  });
  const { account } = useAccount();
  const result = useReadContract({
    abi: [
      {
        type: "function",
        name: "balanceOf",
        stateMutability: "view",
        inputs: [{ name: "account", type: "address" }],
        outputs: [{ type: "uint256" }],
      },
    ],
    address: "0xEcd0D12E21805803f70de03B72B1C162dB0898d9",
    functionName: "balanceOf",
    args: [account?.address as `0x${string}`],
  });

  //监听事件，使用了wagmi提供的 RPC 接口
  useWatchContractEvent({
    address: "0xEcd0D12E21805803f70de03B72B1C162dB0898d9",
    abi: [
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "address",
            name: "minter",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
        ],
        name: "Minted",
        type: "event",
      },
    ],
    eventName: "Minted",
    onLogs() {
      message.success("new minted!");
    },
  });

  const { writeContract } = useWriteContract();
  return (
    <div>
      {result.data?.toString()}
      <Button
        onClick={() => {
          writeContract(
            {
              abi: [
                {
                  type: "function",
                  name: "mint",
                  stateMutability: "payable",
                  inputs: [
                    {
                      internalType: "uint256",
                      name: "quantity",
                      type: "uint256",
                    },
                  ],
                  outputs: [],
                },
              ],
              address: "0xEcd0D12E21805803f70de03B72B1C162dB0898d9",
              functionName: "mint",
              args: [BigInt(1)],
              value: parseEther("0.01"),
            },
            {
              onSuccess: () => {
                message.success("Mint Success");
              },
              onError: (err) => {
                message.error(err.message);
              },
            }
          );
        }}
      >
        mint
      </Button>
    </div>
  );
};

export default function Web3() {
  return (
    <WagmiWeb3ConfigProvider
      chains={[Mainnet]}
      transports={{
        [Mainnet.id]: http(
          "https://api.zan.top/node/v1/eth/mainnet/9ecc4c6bbb4e4b2289a00b61433448cb"
        ),
      }}
      wallets={[MetaMask()]}
    >
      <Address format address="0xEcd0D12E21805803f70de03B72B1C162dB0898d9" />
      <NFTCard
        address="0xEcd0D12E21805803f70de03B72B1C162dB0898d9"
        tokenId={641}
      />
      <Connector>
        <ConnectButton />
      </Connector>
      <CallTest />
    </WagmiWeb3ConfigProvider>
  );
}
