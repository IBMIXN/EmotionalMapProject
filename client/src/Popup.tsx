import * as React from "react";
import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, Link } from "@chakra-ui/react"

export const Popup = (): JSX.Element => {
  const show = true;
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: show })
  return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Missing data</ModalHeader>
          <ModalBody>
            If data is missing from the map please try again later. Please see <Link href="https://github.com/IBMIXN/EmotionalMapProject/issues/4" color="brand.500" isExternal>issue #4</Link> on GitHub for more information.
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="brand" mr={3} onClick={onClose}>
              Continue to site
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
  )
};
