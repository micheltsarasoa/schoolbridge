'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const idCardData = {
  schoolName: 'SchoolBridge High School',
  studentName: 'Student User',
  studentId: 'SB-12345',
  class: 'Grade 10',
  validFrom: '2025-01-01',
  validTo: '2025-12-31',
  qrCode: '/placeholder.svg?height=128&width=128', // Placeholder for QR code
  avatar: '/placeholder.svg?height=128&width=128',
};

export default function StudentIdCardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Digital ID Card</h1>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle>{idCardData.schoolName}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <Avatar className="h-32 w-32">
            <AvatarImage src={idCardData.avatar} alt={idCardData.studentName} />
            <AvatarFallback>{idCardData.studentName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="text-center">
            <p className="text-2xl font-bold">{idCardData.studentName}</p>
            <p className="text-muted-foreground">{idCardData.studentId}</p>
            <p className="text-muted-foreground">{idCardData.class}</p>
          </div>
          <div className="w-32 h-32 bg-gray-200 flex items-center justify-center">
            <img src={idCardData.qrCode} alt="QR Code" />
          </div>
          <div className="text-center text-sm text-muted-foreground">
            <p>Valid from: {idCardData.validFrom}</p>
            <p>Valid to: {idCardData.validTo}</p>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-center">
        <Button>Download as PDF</Button>
      </div>
    </div>
  );
}
