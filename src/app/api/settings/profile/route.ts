import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { name, image } = await parseFormData(req)

  console.log(name)
  console.log(image)

  return NextResponse.json({
    success: true,
  })
}

async function parseFormData(req: NextRequest) {
  const formData = await req.formData()
  const formDataObject: Record<string, any> = {}
  for (const [key, value] of formData.entries()) {
    // Remove the '[]' suffix in case because inputfile
    const newKey = key.replace('[]', '')
    formDataObject[newKey] = value
  }
  return formDataObject
}
