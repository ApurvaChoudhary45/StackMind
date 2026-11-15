import { deleteOwnedRecord } from '@/lib/delete-owned-record'

export function DELETE(request: Request) {
    return deleteOwnedRecord(request, 'notes', 'noteId')
}
