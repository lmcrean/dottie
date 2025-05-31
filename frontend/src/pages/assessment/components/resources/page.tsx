import { Link } from 'react-router-dom';
import { Button } from '@/src/components/buttons/button';
import { Card, CardContent } from '@/src/components/ui/card';
import { ExternalLink, Heart } from 'lucide-react';
import PageTransition from '../../animations/page-transitions';

export default function ResourcesPage() {
  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col">
        <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col p-6">
          <h1 className="mb-6 text-2xl font-bold">Resources & Next Steps</h1>

          <div className="mb-8">
            <h2 className="mb-4 text-lg font-semibold">Helpful Resources</h2>

            <div className="space-y-4">
              <Card className="mb-8 w-full shadow-md transition-shadow duration-300 hover:shadow-lg">
                <CardContent className="pb-8 pt-8">
                  <h3 className="font-medium">ACOG: Your First Period</h3>
                  <p className="mb-3 text-sm text-gray-600">
                    Information about what to expect from your menstrual cycle
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Learn more
                    <ExternalLink className="ml-2 h-3 w-3" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="mb-8 w-full shadow-md transition-shadow duration-300 hover:shadow-lg">
                <CardContent className="pb-8 pt-8">
                  <h3 className="font-medium">Teenage Menstrual Health</h3>
                  <p className="mb-3 text-sm text-gray-600">
                    Age-appropriate guidance on managing your period
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Learn more
                    <ExternalLink className="ml-2 h-3 w-3" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="mb-8 w-full shadow-md transition-shadow duration-300 hover:shadow-lg">
                <CardContent className="pb-8 pt-8">
                  <h3 className="font-medium">Talking to Parents About Periods</h3>
                  <p className="mb-3 text-sm text-gray-600">
                    Tips for discussing menstrual health with adults you trust
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Learn more
                    <ExternalLink className="ml-2 h-3 w-3" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="mb-4 text-lg font-semibold">{`What's Next`}</h2>

            <div className="space-y-4">
              <Card className="mb-8 w-full shadow-md transition-shadow duration-300 hover:shadow-lg">
                <CardContent className="pb-8 pt-8">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-pink-100">
                      <span className="font-medium text-pink-600">1</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">Start Tracking Your Cycle</h3>
                      <p className="mb-3 text-sm text-gray-600">
                        Setting up your personalized cycle tracking will help you better understand
                        your patterns.
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        Set up cycle tracking
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-8 w-full shadow-md transition-shadow duration-300 hover:shadow-lg">
                <CardContent className="pb-8 pt-8">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-pink-100">
                      <span className="font-medium text-pink-600">2</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">Learn About Your Body</h3>
                      <p className="mb-3 text-sm text-gray-600">
                        Explore our educational materials designed specifically for teens about
                        menstrual health.
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        View resources
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-8 w-full shadow-md transition-shadow duration-300 hover:shadow-lg">
                <CardContent className="pb-8 pt-8">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-pink-100">
                      <span className="font-medium text-pink-600">3</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">Talk To Someone</h3>
                      <p className="mb-3 text-sm text-gray-600">
                        Consider sharing your results with a parent, trusted adult, or healthcare
                        provider if you have concerns.
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        Get conversation tips
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="mb-8 w-full border-pink-100 bg-pink-50 shadow-md transition-shadow duration-300 hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex gap-3">
                <Heart className="mt-0.5 h-5 w-5 flex-shrink-0 text-pink-600" />
                <div>
                  <h3 className="mb-2 font-semibold text-gray-800">
                    A Note on Teen Menstrual Health
                  </h3>
                  <p className="mb-2 text-sm text-gray-600">
                    {`It's completely normal for your periods to be irregular when you're first
                    starting. For most people, it takes 2-3 years after your first period for cycles
                    to become regular. During this time, cycle lengths can vary widely.`}
                  </p>
                  <p className="text-sm text-gray-600">
                    {`   Learning about your body and tracking your cycle is a great first step towards
                    taking charge of your health. Remember that everyone's body is different, and
                    what's "normal" varies from person to person.`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <footer className="mt-auto text-center">
            <div className="mb-3 flex items-center justify-center">
              <span className="font-semibold text-pink-600">Dottie</span>
            </div>
            <div className="mb-2 text-xs text-gray-500">
              Your health information is private and secure.
            </div>
            <div className="flex justify-center gap-4 text-xs text-gray-500">
              <Link to="#">Privacy Policy</Link>
              <Link to="#">Terms of Use</Link>
              <Link to="#">Contact Support</Link>
            </div>
          </footer>
        </main>
      </div>
    </PageTransition>
  );
}
