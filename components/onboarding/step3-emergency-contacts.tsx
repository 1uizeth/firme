"use client"

import { useState, useEffect, useRef } from "react"
import OnboardingLayout from "./onboarding-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Plus } from "lucide-react"
import { useAccount } from "wagmi"
import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi-actions" // Replace with actual imports
import { useWeb3Auth } from "@/contexts/web3auth-context"
import { useReclaim } from "@/contexts/reclaim-context"
import type { ReclaimContactType, ContactRelationship } from "@/lib/reclaim-types"

interface Step3EmergencyContactsProps {
  onComplete: () => void
  currentStep: number
  totalSteps: number
}

export default function Step3EmergencyContacts({
  onComplete,
  currentStep,
  totalSteps
}: Step3EmergencyContactsProps) {
  const { address } = useAccount()
  const {
    state: { authInfo },
    fetchAuthInfo,
  } = useWeb3Auth()

  const {
    contacts: contextContacts,
    addContactAndSendInvitation,
    removeContact: removeContextContact,
  } = useReclaim()

  const [localAuthInfo, setLocalAuthInfo] = useState<string | null>(null)
  const isFetchingAuthRef = useRef(false)
  const [nameValue, setNameValue] = useState("")
  const [numberValue, setNumberValue] = useState("")
  const [entryError, setEntryError] = useState<string>()
  const [isLoading, setIsLoading] = useState(false)
  const [numbersList, setNumbersList] = useState<{ names: string[]; numbers: string[] } | null>(null)

  const effectiveAuthInfo = localAuthInfo || authInfo

  const { data: numbersListData, refetch: refetchNumbersList } = useReadContract({
    functionName: 'getNumbersList',
    args: [effectiveAuthInfo],
    query: { enabled: !!effectiveAuthInfo },
  })

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
  } = useWaitForTransactionReceipt({ hash: addToNumbersListTxHash })

  const isInteractingWithChain = isWriteContractPending || (addToNumbersListTxHash && isTransactionReceiptPending)

  useEffect(() => {
    if (authInfo) {
      setLocalAuthInfo(authInfo)
    }
  }, [authInfo])

  useEffect(() => {
    if (effectiveAuthInfo && numbersListData) {
      setNumbersList({
        names: numbersListData[0],
        numbers: numbersListData[1],
      })
    }
  }, [numbersListData, effectiveAuthInfo])

  useEffect(() => {
    const fetchAuth = async () => {
      if (!effectiveAuthInfo && address && !isFetchingAuthRef.current) {
        try {
          isFetchingAuthRef.current = true
          const urlParams = new URLSearchParams(window.location.search)
          const authParam = urlParams.get('auth')
          if (authParam && authParam.length > 100) {
            setLocalAuthInfo(authParam)
          } else {
            await fetchAuthInfo()
          }
        } finally {
          isFetchingAuthRef.current = false
        }
      }
    }

    fetchAuth()
  }, [])

  const handleAddToNumbersList = async () => {
    if (isFetchingAuthRef.current) {
      setEntryError('Still processing previous request')
      return
    }

    setEntryError(undefined)
    setIsLoading(true)

    try {
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

      let currentAuthInfo = effectiveAuthInfo
      if (!currentAuthInfo) {
        isFetchingAuthRef.current = true
        await fetchAuthInfo()
        if (authInfo) {
          setLocalAuthInfo(authInfo)
          currentAuthInfo = authInfo
        }
        if (!currentAuthInfo) {
          setEntryError('Authentication failed - please try again')
          return
        }
        isFetchingAuthRef.current = false
      }

      await writeContract({
        functionName: 'addToNumbersList',
        args: [nameValue, numberValue, currentAuthInfo],
      })

      const determinedType: ReclaimContactType["type"] =
        numberValue.includes("@") ? "email" : numberValue.match(/^\+?[0-9\s-()]+$/) ? "phone" : "other"

      await addContactAndSendInvitation({
        name: nameValue.trim(),
        contactMethod: numberValue.trim(),
        type: determinedType,
        relationship: "Other",
      })

    } catch (error) {
      setEntryError((error as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isTransactionReceiptSuccess) {
      setNameValue("")
      setNumberValue("")
      refetchNumbersList()
    } else if (isTransactionReceiptError || isWriteContractError) {
      setEntryError(transactionReceiptError?.message ?? writeContractError?.message)
      setIsLoading(false)
    }
  }, [isTransactionReceiptSuccess, isTransactionReceiptError, isWriteContractError])

  const handleRemoveContact = async (nameToRemove: string) => {
    if (isLoading || !numbersList || !effectiveAuthInfo) return

    setIsLoading(true)
    try {
      const index = numbersList.names.findIndex(name => name === nameToRemove)
      if (index === -1) return

      const updatedNames = [...numbersList.names]
      const updatedNumbers = [...numbersList.numbers]
      updatedNames.splice(index, 1)
      updatedNumbers.splice(index, 1)

      setNumbersList({ names: updatedNames, numbers: updatedNumbers })

      const idToRemove = contextContacts.find(c => c.name === nameToRemove)?.id
      if (idToRemove) await removeContextContact(idToRemove)

    } catch (error) {
      setEntryError((error as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <OnboardingLayout stepNumber={currentStep} totalSteps={totalSteps} headerText="Contacts">
      <p className="text-neutral-700 mb-6 text-lg">Add trusted contacts for recovery</p>

      <div className="space-y-4 mb-6 text-left">
        <Input
          type="text"
          placeholder="Contact Name"
          value={nameValue}
          onChange={(e) => setNameValue(e.target.value)}
          className="border-neutral-300 focus:border-[#00A86B]"
        />
        <Input
          type="text"
          placeholder="Contact Method (e.g., email or phone)"
          value={numberValue}
          onChange={(e) => setNumberValue(e.target.value)}
          className="border-neutral-300 focus:border-[#00A86B]"
        />
        <Button
          onClick={handleAddToNumbersList}
          variant="outline"
          className="w-full border-[#00A86B] text-[#00A86B] hover:bg-[#00A86B]/10 rounded-md"
          disabled={isLoading}
        >
          <Plus className="mr-2 h-4 w-4" />
          {isLoading ? "Adding..." : "Add Contact & Send Invite"}
        </Button>
        {entryError && <p className="text-red-600 text-sm">{entryError}</p>}
      </div>

      {numbersList?.names?.length > 0 && (
        <div className="mb-8 space-y-2 text-left">
          <h3 className="font-semibold text-neutral-800">Trusted Contacts:</h3>
          <ul className="list-none p-0">
            {numbersList.names.map((name, index) => (
              <li key={index} className="flex justify-between items-center p-2 border-b border-neutral-200">
                <span className="text-sm text-neutral-700">{name} - <span className="font-mono text-xs">{numbersList.numbers[index]}</span></span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveContact(name)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-500/10"
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
          (numbersList?.names.length ?? 0) === 0 ||
          isInteractingWithChain ||
          isFetchingAuthRef.current
        }
      >
        Continue
      </Button>

      <p className="text-xs text-neutral-500 mt-2">
        Contacts will receive an invitation to join your network. You need at least one contact with a pending or active invitation to continue.
      </p>
    </OnboardingLayout>
  )
}