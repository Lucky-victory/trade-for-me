import { useCustomSign, useWalletAccount } from "@/hooks";
import { maskWalletAddress } from "@/utils";
import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useCallback, useEffect } from "react";
import { BiSolidLogOut } from "react-icons/bi";
import { BsChevronDown } from "react-icons/bs";

export default function WalletConnectButton() {
  const { connected, disconnect, publicKey, connect } = useWallet();
  const wm = useWalletModal();
  const { address } = useWalletAccount();
  const { signCustomMessage, signed, setSigned } = useCustomSign();
  async function handleConnect() {
    try {
     wm.setVisible(true);
    } catch (error) {}
  }
  async function handleDisconnect() {
    try {
      await disconnect();
      setSigned(false);
    } catch (error) {}
  }
  const signMessageCb = useCallback(async () => {
    await signCustomMessage();
  }, [signCustomMessage]);
  useEffect(() => {
    if (connected && !signed) signMessageCb();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected, signed]);
  return (
    <>
      {!connected && (
        <Button
          fontWeight={600}
          size={{ md: "lg", base: "md" }}
          onClick={async () => await handleConnect()}
          variant={"outline"}
        >
          Connect Wallet
        </Button>
      )}
      {connected && publicKey && (
        <Menu>
          <MenuButton
            rightIcon={<BsChevronDown />}
            as={Button}
            colorScheme="gray"
          >
            {maskWalletAddress(address!)}
          </MenuButton>
          <MenuList>
            <MenuItem
              icon={<BiSolidLogOut />}
              onClick={async () => await handleDisconnect()}
            >
              disconnect
            </MenuItem>
          </MenuList>
        </Menu>
      )}
    </>
  );
}
