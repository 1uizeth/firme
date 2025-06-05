"use client"
import OnboardingLayout from "./onboarding-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from '@/components/ui/card'
import { X, Plus } from "lucide-react"
import { useReclaim } from "@/contexts/reclaim-context"
import type { Contact as ReclaimContactType, ContactRelationship } from "@/lib/reclaim-types"
import { FC, useEffect, useState } from 'react'
import { StringUtils } from '@/app/utils/string.utils'
import classes from './index.module.css'
import { RevealInput } from '@/components/reveal-input'
import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { WAGMI_CONTRACT_CONFIG, WagmiUseReadContractReturnType } from '@/app/utils/config'
import { useWeb3Auth } from '@/app/hooks/use-web3-auth'


interface Step3EmergencyContactsProps {
  onComplete: () => void
  onBack?: () => void
  currentStep: number
  totalSteps: number
}

export default function Step3EmergencyContacts({ onComplete, onBack, currentStep, totalSteps }: Step3EmergencyContactsProps) {
  const { address } = useAccount()
  const {
    state: { authInfo },
    fetchAuthInfo,
  } = useWeb3Auth()

  const { data: numbersListData, refetch: refetchNumbersList } = useReadContract({
    ...WAGMI_CONTRACT_CONFIG,
    functionName: 'getNumbersList',
    args: [authInfo],
    query: {
      enabled: !!authInfo,
    },
  }) satisfies WagmiUseReadContractReturnType<'getNumbersList', [string[], string[]], [string]>

  const {
    data: addToNumbersListTxHash,
    writeContract,
    isPending: isWriteContractPending,
    isError: isWriteContractError,
    error: writeContractError,
  } = useWriteContract()
  const {
    isPending: isTransactionReceiptPending,
    isSuccess: isTransactionReceiptSuccess,
    isError: isTransactionReceiptError,
    error: transactionReceiptError,
  } = useWaitForTransactionReceipt({
    hash: addToNumbersListTxHash,
  })

  const isInteractingWithChain = isWriteContractPending || (addToNumbersListTxHash && isTransactionReceiptPending)

  const [numbersList, setNumbersList] = useState<{ names: string[], numbers: string[] } | null>(null)
  const [nameValue, setNameValue] = useState<string>('')
  const [numberValue, setNumberValue] = useState<string>('')
  const [numbersListRevealLabel, setNumbersListRevealLabel] = useState<string>()
  const [numbersListError, setNumbersListError] = useState<string | null>(null)
  const [entryError, setEntryError] = useState<string>()
  const [hasBeenRevealedBefore, setHasBeenRevealedBefore] = useState(false)

  useEffect(() => {
    if (authInfo && numbersListData) {
      setNumbersList({
        names: numbersListData[0],
        numbers: numbersListData[1],
      })
    }
  }, [numbersListData])

  const fetchNumbersList = async () => {
    setNumbersListError(null)
    setNumbersListRevealLabel('Please sign message and wait...')

    try {
      await fetchAuthInfo()
      await refetchNumbersList()
      setNumbersListRevealLabel(undefined)
      setHasBeenRevealedBefore(true)

      return Promise.resolve()
    } catch (ex) {
      setNumbersListError((ex as Error).message)
      setNumbersListRevealLabel('Something went wrong! Please try again...')

      throw ex
    }
  }

  useEffect(() => {
    if (isTransactionReceiptSuccess) {
      setNameValue('')
      setNumberValue('')

      if (!hasBeenRevealedBefore) {
        setNumbersList(null)
        setNumbersListRevealLabel('Tap to reveal')
      } else {
        fetchNumbersList()
      }
    } else if (isTransactionReceiptError || isWriteContractError) {
      setEntryError(transactionReceiptError?.message ?? writeContractError?.message)
    }
  }, [isTransactionReceiptSuccess, isTransactionReceiptError, isWriteContractError])

  const handleRevealChanged = async (): Promise<void> => {
    if (!isInteractingWithChain) {
      return await fetchNumbersList()
    }

    return Promise.reject()
  }

  const {
    contacts: contextContacts,
    addContactAndSendInvitation,
    removeContact: removeContextContact,
    isLoading,
  } = useReclaim()

  const handleAddToNumbersList = async () => {
    console.log("Starting handleAddToNumbersList");
    console.log("Wallet status:", { 
      address,
      authInfo,
      isInteractingWithChain,
      contractConfig: WAGMI_CONTRACT_CONFIG 
    });
    
    setEntryError(undefined)

    if (!address) {
      setEntryError('Please connect your wallet first')
      return
    }

    if (!nameValue) {
      setEntryError('Name is required!')
      return
    }

    if (!numberValue) {
      setEntryError('Number is required!')
      return
    }

    if (!authInfo) {
      console.log("No authInfo available:", authInfo);
      setEntryError('Authentication required!')
      return
    }

    try {
      console.log("Attempting contract write with:", {
        nameValue,
        numberValue,
        authInfo,
        config: WAGMI_CONTRACT_CONFIG
      });
      
      await writeContract({
        ...WAGMI_CONTRACT_CONFIG,
        functionName: 'addToNumbersList',
        args: [nameValue, numberValue, authInfo],
      })
    } catch (error) {
      console.error('Contract write error:', writeContractError || error)
      setEntryError(writeContractError?.message || (error as Error).message)
      throw error; // Re-throw to be caught by the parent try-catch
    }
  }

  const handleAddContact = async () => {
    console.log("Starting handleAddContact");
    if (nameValue.trim() && numberValue.trim()) {
      let determinedType: ReclaimContactType["type"] = "other"
      if (numberValue.includes("@")) {
        determinedType = "email"
      } else if (numberValue.match(/^\+?[0-9\s-()]+$/)) {
        determinedType = "phone"
      }

      console.log("Determined type:", determinedType);

      try {
        // If it's a phone number, add to the contract
        if (determinedType === "phone") {
          console.log("Phone number detected, calling handleAddToNumbersList");
          await handleAddToNumbersList()
        }

        // Add to contacts list
        const defaultRelationship: ContactRelationship = "Other"
        await addContactAndSendInvitation({
          name: nameValue.trim(),
          contactMethod: numberValue.trim(),
          type: determinedType,
          relationship: defaultRelationship,
        })

        // Clear the inputs after successful addition
        setNameValue("")
        setNumberValue("")
      } catch (error) {
        console.error('Error adding contact:', error)
        setEntryError((error as Error).message)
      }
    } else {
      console.log("Form validation failed:", { nameValue, numberValue });
    }
  }

  const handleRemoveContact = async (id: string) => {
    await removeContextContact(id)
  }

  return (
    <OnboardingLayout 
      stepNumber={currentStep} 
      totalSteps={totalSteps} 
      headerText="Add Emergency Contacts"
      onBack={onBack}
      showBackButton={true}
    >
      <p className="text-neutral-700 mb-6 text-lg">Add trusted contacts for recovery</p>

      <div className="space-y-4 mb-6 text-left">
        <Input
          type="text"
          placeholder="Contact Name"
          value={nameValue}
          onChange={(e) => setNameValue(e.target.value)}
          className="border-neutral-300 focus:border-[#00A86B]"
          aria-label="Contact Name"
        />
        <Input
          type="text"
          placeholder="Contact Method (e.g., email or phone)"
          value={numberValue}
          onChange={(e) => setNumberValue(e.target.value)}
          className="border-neutral-300 focus:border-[#00A86B]"
          aria-label="Contact Method"
        />
        {entryError && (
          <p className="text-red-500 text-sm">{entryError}</p>
        )}
        <Button
          onClick={handleAddContact}
          variant="outline"
          className="w-full border-[#00A86B] text-[#00A86B] hover:bg-[#00A86B]/10 rounded-md"
          aria-label="Add Contact"
          disabled={isLoading || isInteractingWithChain}
        >
          <Plus className="mr-2 h-4 w-4" />
          {isLoading || isInteractingWithChain ? "Adding..." : "Add Contact & Send Invite"}
        </Button>
      </div>

      {contextContacts.length > 0 && (
        <div className="mb-8 space-y-2 text-left">
          <h3 className="font-semibold text-neutral-800">Trusted Contacts:</h3>
          <ul className="list-none p-0">
            {contextContacts.map((contact) => (
              <li key={contact.contactId} className="flex justify-between items-center p-2 border-b border-neutral-200">
                <span className="text-sm text-neutral-700">
                  {contact.name} -{" "}
                  <span className="font-mono text-xs">
                    {contact.contactMethod} ({contact.type})
                  </span>
                  {contact.status === "pending_invitation" && (
                    <span className="ml-2 text-xs text-blue-600">(Invitation Pending)</span>
                  )}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveContact(contact.contactId)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-500/10"
                  aria-label={`Remove ${contact.name}`}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Button
        onClick={onComplete}
        className="w-full bg-[#00A86B] hover:bg-[#008F5B] text-white py-3 text-lg rounded-md"
        disabled={
          contextContacts.filter((c) => c.status === "active" || c.status === "pending_invitation").length === 0 ||
          isLoading
        }
        aria-label="Complete setup and continue"
      >
        Continue
      </Button>
      <p className="text-xs text-neutral-500 mt-2">
        Contacts will receive an invitation to join your network. You need at least one contact with a pending or active
        invitation to continue.
      </p>
    </OnboardingLayout>
  )
}
