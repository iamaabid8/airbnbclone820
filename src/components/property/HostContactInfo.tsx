
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail, Phone, User } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface HostContactInfoProps {
  hostId: string;
  propertyTitle: string;
  isAuthenticated: boolean;
}

export const HostContactInfo = ({ hostId, propertyTitle, isAuthenticated }: HostContactInfoProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hostData, setHostData] = useState<{
    name: string;
    email: string;
    phone?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleContactRequest = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to contact the host",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // In a real application, you would fetch the host contact details from your database
      // This is a mock implementation
      setTimeout(() => {
        setHostData({
          name: "Property Host",
          email: "host@example.com",
          phone: "+1 (555) 123-4567",
        });
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching host data:", error);
      toast({
        title: "Failed to load host information",
        description: "Please try again later",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full mt-4"
          onClick={handleContactRequest}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Contact Host Directly"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Contact Host</DialogTitle>
          <DialogDescription>
            Get in touch with the host about {propertyTitle}
          </DialogDescription>
        </DialogHeader>
        
        {hostData && (
          <div className="space-y-4 mt-4">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-700">Host Name</p>
                <p>{hostData.name}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-700">Email</p>
                <a href={`mailto:${hostData.email}`} className="text-blue-600 hover:underline">
                  {hostData.email}
                </a>
              </div>
            </div>
            
            {hostData.phone && (
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Phone</p>
                  <a href={`tel:${hostData.phone}`} className="text-blue-600 hover:underline">
                    {hostData.phone}
                  </a>
                </div>
              </div>
            )}
            
            <div className="bg-yellow-50 p-3 rounded-md mt-4">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> Payment is handled directly between you and the host. 
                The platform does not manage or guarantee payments.
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
