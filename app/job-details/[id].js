import { Text, View, SafeAreaView } from 'react-native'
import { Stack, useRouter, Router, useSearchParams } from 'expo-router'
import { useCallback, useState } from 'react'
import { Company, JobAbout, JobFooter, JobTabs, ScreenHeaderBtn, Specifics } from '../../components'
import { COLORS, icons, SIZES } from '../../constants'
import useFetch from '../../hook/useFetch'
import { RefreshControl, } from 'react-native-gesture-handler'
import { ScrollView, ActivityIndicator, FlatList } from 'react-native';


const tabs = ["სამსახურის შესახებ", "მთავარი მოთხოვნები", "შესაძლებლობები"]
const JobDetails = () => {
    const params = useSearchParams()
    const router = useRouter();
    const { data, isLoading, error, refetch } = useFetch('job-details', {
        job_id: params.id
    })
    const [refreshing, setRefreshing] = useState(false)
    const [activeTab, setActiveTab] = useState(tabs[0])


    const displayTabContent = () => {
        switch (activeTab) {
            case tabs[1]:
                return <Specifics title="მთავარი მოთხოვნები"
                    points={data[0].job_highlights?.Qualifications ?? ['N/A']}
                />
            case tabs[0]:
                return <JobAbout title="სამსახურის შესახებ"
                    info={data[0].job_description ?? ['No data provided']}
                />

            case tabs[2]:
                return <Specifics title="შესაძლებლობები"
                    points={data[0].job_highlights?.Responsibilities ?? ['N/A']}
                />

            default:
                return <JobAbout job={data} />
        }
    }

    const onRefresh = () => {
        setRefreshing(true)
        refetch()
            .then(() => {
                setRefreshing(false)
            })
    }


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
            <Stack.Screen options={{
                headerStyle: { backgroundColor: COLORS.lightWhite },
                headerShadowVisible: false,
                headerBackVisible: false,
                headerLeft: () => (
                    <ScreenHeaderBtn
                        iconUrl={icons.left}
                        dimension='60%'
                        handlePress={() => router.back()}
                    />
                ),
                headerRight: () => (
                    <ScreenHeaderBtn

                        iconUrl={icons.share}
                        dimension='60%'

                    />
                ),
                headerTitle: ''
            }}
            />

            <>
                <View>
                    <ScrollView showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    >
                        {isLoading ? (
                            <ActivityIndicator size='large' color={COLORS.secondary} />
                        ) : error ? (
                            <Text>Something went wrong</Text>
                        ) : data.length === 0 ? (
                            <Text>No data available</Text>
                        ) : (
                            <View style={{ padding: SIZES.medium, paddingBottom: 100 }}>
                                <Company
                                    companyLogo={data[0].employer_logo}
                                    jobTitle={data[0].job_title}
                                    companyName={data[0].employer_name}
                                    location={data[0].job_country}
                                />

                                <JobTabs
                                    tabs={tabs}
                                    activeTab={activeTab}
                                    setActiveTab={setActiveTab}
                                />
                                {displayTabContent()}

                            </View>
                        )}
                    </ScrollView>
                    <JobFooter url={data[0]?.job_google_link ?? 'https://careers.google.com/jobs/results'} />
                </View>
            </>
        </SafeAreaView>
    )
}

export default JobDetails
