from django.contrib.auth.models import User
from django.core.management.base import BaseCommand
from project.home.models import Profile


class Command(BaseCommand):
    help = "Will copy over categorizer auth credentials from staging"

    def handle(self, *args, **options):
        usernames = ["DE2E7CC202FE50CEA3FA72CBB0B9B6","3FF4AF7F1B93FA4913A2FEFE5CDD79","22AC5B4E11B4913397301BF8166E5F","4FD8DF7FC00995609DCE43B2BAD6A7","0235FD9702344B75DBD2B33716A552","6EE83025382AD0329625C3BD77A548","F6FC9E7FE79C399D47FD4C7DD661AA","DD8CD67ABFBCAA2F2A6658485889B9","99936AB8788B39263DE549870B062F","0EF8002A84816A268A3CD7A8764963","CA214EFA7BB58387F1E82FD5291BEE","603FC9435CDB39E1EDE80C5BBC5B69","C04F1464C02BFCAFC780E34D5AD086","8923DC0A2099B5125FCBC809E312C7","8EF2ADDCA3F5C12C6B56C875055CF0","551F82F80058593634AD62F6334F83","7F1A1097BFBBF585AA5F806E8ADD08","8C044EB737E7A1B2D2A09524B2CF25","AAA38D07BB9DD1DF51BF1EFAD5E45B","6732C83A01DB309D93F9E73CC8CD05","88F4F6A7BE5D35989876EAB600A302","AD9CBD6E57EEE52015F374701C3211","DB8731B468AE93A32451E56CD8FD09","DEC65BB34D4CD95AB2D5E9F8670BDC","DACFECA7EFFBBA57257055528F20DC","870570D39A15A80DF1C33BDAF00470","49188D0547B4CC853E5B7934C52CF5","699D49F07B2F69B28273C6E6185FA9","4D2AF6B5145926C45A8292239363E8","73617507D218BA842D80CEC2823154","9206A0E67790B746868A02FB159865","20B98D4070D5C74D6F79087953FD16","79832745E98128069BDE6C7B1C44E3","2050B6F745A53179822BCA1F914672","810919CB6CE5FE00905D04F83D8043","EA417A0CAAF43AEF676E12B9589738","FCBE6350ADDCD92C786328EA10A3EF","EE3BBEE803756433E1BCBD34ECBB84","A6F078EDEFB161C773DC6BA81809B3","F8DDFF4DFEB50CBE55931D5291FA5F","1875D859DE19F5F008FD67F8DF5D64","218093606A0D9D37C07BFABA9852EE","915E78FB7E651282A6962DB6534E75","F7C09CE8255E556C9AF571A0568339","5569E126CED5A63355CAE7E0FC7D4F","047C45F5C1910844867751AB8D7E80"]
        passwords = ["pbkdf2_sha256$15000$to92uyCaUEpZ$XztuuoPQK4EudkV1UhL905ngWblMM5iV73OLfbTjPd8=","pbkdf2_sha256$15000$ol0dWgweD1tG$zz38UyhNr20LoXzDqpYIXmJGssdMah6zOM5yjDD047g=","pbkdf2_sha256$15000$v44CM4nMebCP$3P3XFt3/ZzKilgrj1Qke5AOnX7QE6RXH9CuE+vGwJ0s=","pbkdf2_sha256$15000$ciU9hq1521Wm$RfdDUlEs7IOuywJR9Rt+4rfuLnwa3XaNgAMNf+IUVGM=","pbkdf2_sha256$15000$KUVlp5OnbLHO$8oQFrH/Kaq/usU7FFZf1xRfyETWkODYhwV13fhz4xM0=","pbkdf2_sha256$15000$HoJJY8fIJCHq$bYGd16F20+QqSrHQpu4gKVzhBy+21RpB6o6743Mox/Q=","pbkdf2_sha256$15000$7knsEqdgVazd$wW49baT1Cayzp/2ODcngKivY4qW6wuNcXJKHGarR7MY=","pbkdf2_sha256$15000$fuEmNZ6735F8$5xe/9eFUlw96lwYiKWR4xBuPqUutJPvqvILTMzJ62IA=","pbkdf2_sha256$15000$FKkLasboMHu2$60AJCKi54RAII0asRMDLX357m+aarkOVmFGtzPFZGzA=","pbkdf2_sha256$15000$sB825gZXRT8x$AQ1FRZdIgX59OVBNZ371fPaMJ5ocIn0E7ZWJIc9I4Uc=","pbkdf2_sha256$15000$K40DGXEYAmhH$3UXykKIjG8eyzt2YlgKVZK91UfhLYa6WPo7GrCoSi3A=","pbkdf2_sha256$15000$30mGXC6dJXuL$ZLwo9PBb4XIeYN2M1TEG0e/5crcxHxIjrJSb1SJ1Ens=","pbkdf2_sha256$15000$iigVHWGlGuaZ$svifOAMFE7whthDSBxMPBdgp7Umb71YzXr4s2to6nJU=","pbkdf2_sha256$15000$pz703zb4RPwH$/QqkeBO14md2topfPoST9TCHxKBes37vhwGrNBaKzIg=","pbkdf2_sha256$15000$AkSn3awyM7RB$gmuylJ1wYy+nDKG7GMes5QPCBL45EKRJGBByPzETlw8=","pbkdf2_sha256$15000$dGP4lBzAWyQk$NauhB0/Vr8yVOXEmNKbPv97sDcHmKol1PAhs48J3tQA=","pbkdf2_sha256$15000$PYhVuE8vHwAz$11gZmOv2zB3QMylk+7hUes5uzDLmnTQWXBM5mN1W9X8=","pbkdf2_sha256$15000$zuioJvGfknIs$FG8W2MxgqwlNkoMXD41KXvJFCKZR+6pPP6wR4RhtGDo=","pbkdf2_sha256$15000$I3b1LKCNdMd4$FzrOx/ttQsEAsdd5LlPvB3k3SHk6J/83E12h/WfK1Sw=","pbkdf2_sha256$15000$HBg82heVozpR$uwam//SL00SAxtzGmR8vm9H5GSZk6xK54uOm7g/wEhs=","pbkdf2_sha256$15000$njxRb2DuooJY$RApseTp12iXA4vVPuvGfkNpTECew8f/bxa10zwqel2E=","pbkdf2_sha256$15000$cbGXmpbNkb7q$gva8YlOs9D++PsupJ7Z4JpJAspRWzQMnjHbn2W6lH2Y=","pbkdf2_sha256$15000$502ShyjMkUOx$8atelHcA3bKmZhI/nCsxdwk9Q1c8243UkupgkvBTuKE=","pbkdf2_sha256$15000$P86gyAWzgC5D$MGXtE8GSaERhQDOTThN4i++yRRkQY9gC2gCDkU05ivk=","pbkdf2_sha256$15000$Ql79bqBRb7Gm$yQ7i0l/3XZwiZC5PJq4HyHCyIHLUx7ZW+SGFnHDrpLU=","pbkdf2_sha256$15000$GuTGtapsmpc3$cpzcUkj+YSBRoza6Pp2+tYtN75tGG/B30niaUJPDJSs=","pbkdf2_sha256$15000$1bd1YZ9QDNov$k/n/iEs6LD2ENJCfOAbIxeGP0PNmhOqn4mu2ttBtBHE=","pbkdf2_sha256$15000$s9QTtQxBbOG1$/07z57tPn4pZNYmhFmRlmcuh6Ozkd6gqpAmkgd0ttdw=","pbkdf2_sha256$15000$YLqn4hMKZS4g$0gYsCkSRmGGg8Sm6OAnZL4891B6Qf55FQeq/UBScJHk=","pbkdf2_sha256$15000$sHfpwLbvLEDN$iP/oNn6iAxpupjhpQ2lAbuviX6Wv96eGC2SJgw5pucU=","pbkdf2_sha256$15000$GusIS2OUdSwM$9PTh+aClhhnYl6ia4J+ScgFTRSU+G61G5cJYwOjc1Xo=","pbkdf2_sha256$15000$N5ygpxKEnfmE$lYjQmgu+M683L9CrsdqMqsNYrN/cJWqeH7RFqqv5PyM=","pbkdf2_sha256$15000$u5wtn5oNHwcX$D/G+EcwP7fMWcXcKOEJpxcl/SHsP3ZXD+9Qyj0GBob8=","pbkdf2_sha256$15000$xquAu2uGxoEv$qn6SNE61UEd2uKRMPon0NTDRtmDezEJ8DfONXiPFRNA=","pbkdf2_sha256$15000$YCJvNqP70ASE$k4ZZjTSz0V1pjZ46gpx60HCQPTOjDT0m9DcegMa2fbY=","pbkdf2_sha256$15000$9HSj2XUY3nXT$WMetuiKjWMiIMt6h8ANqMXmSr5/z2lmbhPVtgng7iUk=","pbkdf2_sha256$15000$3llmTph8EC2c$mzae3LDoBXoDpSmXq/3jRGsrgvNmgALPkqbVLEjzUwY=","pbkdf2_sha256$15000$bViB6Lq8jtGr$rkYYPQwd5y63I1f0J8TOkbvIQXpPnxCecbz3YNActlM=","pbkdf2_sha256$15000$1AzUddefSjw8$y9MaL4orFKtypET9gx+kORzYPjn6Y0xvDDgGbrMRqjQ=","pbkdf2_sha256$15000$K6TJtde2mOFt$DorwOto+3CcOMTp+YwQHXHf/ljzXlp+w47PS/ctO09Y=","pbkdf2_sha256$15000$YDEtWjjGZpvh$jmK+e2pKV48RVdD0KIrUejIfq6k5hQmTtweQEjWV4Kc=","pbkdf2_sha256$15000$2isEwyXkuqcF$XJ9FbOuZeq1LB9nbStrZbZVxBYP8jo876kkTFtxTOGs=","pbkdf2_sha256$15000$VjgNqRZS2PgG$UNcXCfduCSX1hfkowRvswQ5onAKkA9CmYzMe+H1GBO8=","pbkdf2_sha256$15000$n0d5ihYsUbWm$kAxSpYMzDP6ej8WdOln+RvBxGSfUqGF0bj8x4UKcCX0=","pbkdf2_sha256$15000$4iOReupiCVGh$8+66Y+075Le0KSltEhXxeDNu6zo4myHvLbjn5PPneY0=","pbkdf2_sha256$15000$dGyqTE2JJ2Ax$NfPgwUGdO3T03vW6hcfAGMClqhGpPrQPf+jzUE4uELA="]
        for i in range(0, len(usernames)):
            user = User(
                username=usernames[i],
                password=passwords[i]
            )
            user.save()
            Profile(
                user = user
            ).save()