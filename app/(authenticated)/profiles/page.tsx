export default function ProfilesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Profiles</h1>
        <p className="text-muted-foreground">Manage user profiles and verification status</p>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">User Profiles</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-muted rounded-md">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-medium">RS</span>
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-foreground">Rahul Sharma</h4>
              <p className="text-sm text-muted-foreground">rahul@example.com</p>
            </div>
            <span className="text-sm text-green-600 font-medium">Verified</span>
          </div>

          <div className="flex items-center gap-4 p-4 bg-muted rounded-md">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-medium">JD</span>
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-foreground">John Doe</h4>
              <p className="text-sm text-muted-foreground">john@example.com</p>
            </div>
            <span className="text-sm text-yellow-600 font-medium">Pending</span>
          </div>

          <div className="flex items-center gap-4 p-4 bg-muted rounded-md">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-medium">JS</span>
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-foreground">Jane Smith</h4>
              <p className="text-sm text-muted-foreground">jane@example.com</p>
            </div>
            <span className="text-sm text-green-600 font-medium">Verified</span>
          </div>
        </div>
      </div>
    </div>
  )
}
